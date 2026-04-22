# Design: Category Filters Endpoint

**Date:** 2026-04-23  
**Status:** Approved

## Overview

Add a `GET /api/categories/:slug/filters` endpoint that returns all available filter options (sizes, colors, product types) for products belonging to a given category and its direct children.

## Endpoint

```
GET /api/categories/:slug/filters
```

### Path Parameters
| Param  | Type   | Description                        |
|--------|--------|------------------------------------|
| `slug` | string | The unique slug of the category    |

### Success Response `200`
```json
{
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Black", "White"],
  "productTypes": ["T-Shirt", "Hoodie", "Jacket"]
}
```

### Error Responses
| Status | Condition                         |
|--------|-----------------------------------|
| 404    | Category slug not found           |
| 400    | Invalid/missing slug param (Zod)  |

---

## Architecture

Follows the existing **Route → Controller → Service** pattern.

```
category.routes.ts      →  GET /:slug/filters
category.controller.ts  →  getCategoryFilters()
category.service.ts     →  getCategoryFilters(slug)
category.schema.ts      →  categorySlugParamSchema (Zod)
```

---

## Service Logic

### Step 1 — Resolve category + children IDs

```ts
const category = await prisma.category.findUnique({
  where: { slug },
  include: { children: { select: { id: true } } }
});

if (!category) throw new NotFoundError('Category not found');

const categoryIds = [category.id, ...category.children.map(c => c.id)];
```

> Handles one level of children (e.g., `men` → `shirts`, `pants`).

### Step 2 — Fire 3 parallel queries

```ts
const [sizeValues, colorValues, productTypes] = await Promise.all([
  // Distinct Size option values for products in those categories
  prisma.productOptionValue.findMany({
    where: {
      option: {
        name: { equals: 'Size', mode: 'insensitive' },
        product: {
          isActive: true,
          categories: { some: { categoryId: { in: categoryIds } } }
        }
      }
    },
    distinct: ['value'],
    select: { value: true }
  }),

  // Distinct Color option values
  prisma.productOptionValue.findMany({
    where: {
      option: {
        name: { equals: 'Color', mode: 'insensitive' },
        product: {
          isActive: true,
          categories: { some: { categoryId: { in: categoryIds } } }
        }
      }
    },
    distinct: ['value'],
    select: { value: true }
  }),

  // Distinct product types
  prisma.productType.findMany({
    where: {
      products: {
        some: {
          isActive: true,
          categories: { some: { categoryId: { in: categoryIds } } }
        }
      }
    },
    select: { name: true }
  })
]);
```

### Step 3 — Return flat response

```ts
return {
  sizes: sizeValues.map(v => v.value),
  colors: colorValues.map(v => v.value),
  productTypes: productTypes.map(pt => pt.name)
};
```

---

## Files to Modify

| File                             | Change                                               |
|----------------------------------|------------------------------------------------------|
| `src/schemas/category.schema.ts` | Add `categorySlugParamSchema`                        |
| `src/services/category.service.ts` | Add `getCategoryFilters(slug)` function            |
| `src/controllers/category.controller.ts` | Add `getCategoryFilters` handler             |
| `src/routes/category.routes.ts`  | Register `GET /:slug/filters`                        |

---

## Notes

- Only `isActive: true` products are considered.
- Option name matching is **case-insensitive** (`Size`, `size`, `SIZE` all match).
- Child category resolution is **one level deep** only; sufficient for current schema usage.
