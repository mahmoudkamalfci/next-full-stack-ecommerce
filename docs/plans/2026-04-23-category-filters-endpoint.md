# Category Filters Endpoint Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `GET /api/categories/:slug/filters` that returns available sizes, colors, and product types for a given category and its direct children.

**Architecture:** Route → Controller → Service following the existing Express pattern. The service resolves category + children IDs in one query, then fires 3 parallel Prisma queries for sizes, colors, and product types.

**Tech Stack:** TypeScript, Express, Prisma (PostgreSQL), Zod, Jest + Supertest

---

## Task 1: Add Zod param schema for category slug

**Files:**
- Modify: `apps/backend/src/schemas/category.schema.ts`

**Step 1: Add the schema**

Add `categorySlugParamSchema` to the existing file:

```ts
import { z } from 'zod';

export const getCategoriesQuerySchema = z.object({
    isFeatured: z.coerce.boolean().optional(),
    limit: z.coerce.number().optional(),
});

export const categorySlugParamSchema = z.object({
  slug: z.string().min(1),
});
```

**Step 2: Commit**

```bash
git add apps/backend/src/schemas/category.schema.ts
git commit -m "feat: add categorySlugParamSchema for filters endpoint"
```

---

## Task 2: Add `getCategoryFilters` service function

**Files:**
- Modify: `apps/backend/src/services/category.service.ts`
- Modify: `apps/backend/src/__tests__/mocks/prisma.mock.ts`
- Create: `apps/backend/src/__tests__/services/category.service.test.ts`

**Step 1: Write the failing test**

Create `apps/backend/src/__tests__/services/category.service.test.ts`:

```ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { mockPrisma } from '../mocks/prisma.mock.js';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

const { getCategoryFilters } = await import('../../services/category.service.js');

describe('getCategoryFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error when category slug is not found', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue(null);
    await expect(getCategoryFilters('nonexistent')).rejects.toThrow('Category not found');
  });

  it('returns sizes, colors and productTypes for a valid category', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue({
      id: 1, slug: 'men', children: [{ id: 2 }, { id: 3 }],
    });
    (mockPrisma.productOptionValue.findMany as any)
      .mockResolvedValueOnce([{ value: 'S' }, { value: 'M' }])
      .mockResolvedValueOnce([{ value: 'Red' }, { value: 'Black' }]);
    (mockPrisma.productType.findMany as any).mockResolvedValue([
      { name: 'T-Shirt' }, { name: 'Hoodie' }
    ]);

    const result = await getCategoryFilters('men');

    expect(result).toEqual({
      sizes: ['S', 'M'],
      colors: ['Red', 'Black'],
      productTypes: ['T-Shirt', 'Hoodie'],
    });
  });

  it('returns empty arrays when category has no products', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue({
      id: 5, slug: 'empty-cat', children: [],
    });
    (mockPrisma.productOptionValue.findMany as any).mockResolvedValue([]);
    (mockPrisma.productType.findMany as any).mockResolvedValue([]);

    const result = await getCategoryFilters('empty-cat');
    expect(result).toEqual({ sizes: [], colors: [], productTypes: [] });
  });
});
```

**Step 2: Add missing models to Prisma mock**

Edit `apps/backend/src/__tests__/mocks/prisma.mock.ts` — add `productOptionValue` and `productType`:

```ts
import { jest } from '@jest/globals';

const mockPrisma: any = {
  product: {
    findMany: jest.fn(), findUnique: jest.fn(),
    create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn(),
  },
  category: {
    findMany: jest.fn(), findUnique: jest.fn(),
  },
  productOptionValue: {        // NEW
    findMany: jest.fn(),
  },
  productType: {               // NEW
    findMany: jest.fn(),
  },
  cart: {
    findMany: jest.fn(), findUnique: jest.fn(),
    create: jest.fn(), update: jest.fn(), delete: jest.fn(),
  },
  order: {
    create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export { mockPrisma };
```

**Step 3: Run test to verify it fails**

```bash
cd apps/backend
npx jest --testPathPattern="category.service.test" --no-coverage
```

Expected: FAIL — `getCategoryFilters is not a function`

**Step 4: Implement the service function**

Append to `apps/backend/src/services/category.service.ts`:

```ts
export const getCategoryFilters = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: { select: { id: true } } },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const categoryIds = [category.id, ...category.children.map((c: { id: number }) => c.id)];

  const [sizeValues, colorValues, productTypes] = await Promise.all([
    prisma.productOptionValue.findMany({
      where: {
        option: {
          name: { equals: 'Size', mode: 'insensitive' },
          product: {
            isActive: true,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
        },
      },
      distinct: ['value'],
      select: { value: true },
    }),
    prisma.productOptionValue.findMany({
      where: {
        option: {
          name: { equals: 'Color', mode: 'insensitive' },
          product: {
            isActive: true,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
        },
      },
      distinct: ['value'],
      select: { value: true },
    }),
    prisma.productType.findMany({
      where: {
        products: {
          some: {
            isActive: true,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
        },
      },
      select: { name: true },
    }),
  ]);

  return {
    sizes: sizeValues.map((v: { value: string }) => v.value),
    colors: colorValues.map((v: { value: string }) => v.value),
    productTypes: productTypes.map((pt: { name: string }) => pt.name),
  };
};
```

**Step 5: Run test to verify it passes**

```bash
npx jest --testPathPattern="category.service.test" --no-coverage
```

Expected: PASS (3 tests)

**Step 6: Commit**

```bash
git add apps/backend/src/services/category.service.ts \
        apps/backend/src/__tests__/mocks/prisma.mock.ts \
        apps/backend/src/__tests__/services/category.service.test.ts
git commit -m "feat: add getCategoryFilters service with parallel DB queries"
```

---

## Task 3: Add `getCategoryFilters` controller handler

**Files:**
- Modify: `apps/backend/src/controllers/category.controller.ts`
- Modify: `apps/backend/src/__tests__/routes/category.routes.test.ts`

**Step 1: Write the failing tests**

Add a new `describe` block inside `apps/backend/src/__tests__/routes/category.routes.test.ts`:

```ts
describe('GET /api/categories/:slug/filters', () => {
  it('should return 200 with filters for a valid slug', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue({
      id: 1, slug: 'men', children: [],
    });
    (mockPrisma.productOptionValue.findMany as any)
      .mockResolvedValueOnce([{ value: 'S' }, { value: 'M' }])
      .mockResolvedValueOnce([{ value: 'Red' }]);
    (mockPrisma.productType.findMany as any).mockResolvedValue([{ name: 'T-Shirt' }]);

    const res = await request(app).get('/api/categories/men/filters');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: { sizes: ['S', 'M'], colors: ['Red'], productTypes: ['T-Shirt'] }
    });
  });

  it('should return 404 when category slug does not exist', async () => {
    (mockPrisma.category.findUnique as any).mockResolvedValue(null);
    const res = await request(app).get('/api/categories/nonexistent/filters');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Category not found');
  });
});
```

**Step 2: Run to verify tests fail**

```bash
npx jest --testPathPattern="category.routes.test" --no-coverage
```

Expected: FAIL (route not registered yet)

**Step 3: Add the controller handler**

Add to `apps/backend/src/controllers/category.controller.ts`. Make sure `NotFoundError` is imported:

```ts
import { Request, Response, NextFunction } from 'express';
import * as CategoryService from '../services/category.service.js';
import { getCategoriesQuerySchema } from '../schemas/category.schema.js';
import { NotFoundError } from '../middleware/errorHandler.js';

// ... existing handlers ...

export const getCategoryFilters = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const filters = await CategoryService.getCategoryFilters(slug);
    res.status(200).json({ data: filters });
  } catch (error: any) {
    if (error.message === 'Category not found') {
      return next(new NotFoundError('Category not found'));
    }
    next(error);
  }
};
```

**Step 4: Commit the controller**

```bash
git add apps/backend/src/controllers/category.controller.ts
git commit -m "feat: add getCategoryFilters controller handler"
```

---

## Task 4: Register the route

**Files:**
- Modify: `apps/backend/src/routes/category.routes.ts`

**Step 1: Register the route**

```ts
import express from 'express';
import {
  getCategories,
  getTopCategoriesByProductCount,
  getCategoryFilters,
} from '../controllers/category.controller.js';

const router: express.Router = express.Router();
router.get('/', getCategories);
router.get('/top', getTopCategoriesByProductCount);
router.get('/:slug/filters', getCategoryFilters);  // NEW — must be after /top

export default router;
```

> ⚠️ Keep `/top` above `/:slug/filters` so `top` is not captured as a slug.

**Step 2: Run all category tests**

```bash
npx jest --testPathPattern="category" --no-coverage
```

Expected: PASS (all tests across `category.routes.test.ts` and `category.service.test.ts`)

**Step 3: Run full test suite**

```bash
npx jest --no-coverage
```

Expected: PASS (no regressions)

**Step 4: Final commit**

```bash
git add apps/backend/src/routes/category.routes.ts \
        apps/backend/src/__tests__/routes/category.routes.test.ts
git commit -m "feat: register GET /api/categories/:slug/filters route"
```

---

## Done

The endpoint is live:

```
GET /api/categories/:slug/filters
→ 200 { "data": { "sizes": [...], "colors": [...], "productTypes": [...] } }
→ 404 { "status": "error", "message": "Category not found" }
```
