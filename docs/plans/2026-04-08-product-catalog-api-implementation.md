# Product Catalog API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create strict Router-Controller-Service Backend APIs in Express for Customer Product Catalog.

**Architecture:** Strictly separates Routes, Controllers, and Zod Validated Services based on AGENTS.md guidelines.

**Tech Stack:** Express, Zod, Prisma, Jest, Supertest

---

### Task 1: Product Listing Endpoint Wrapper

**Files:**
- Create: `apps/backend/src/routes/product.routes.ts`
- Create: `apps/backend/src/controllers/product.controller.ts`
- Create: `apps/backend/src/__tests__/routes/product.routes.test.ts`

**Step 1: Write the failing test**

```typescript
// apps/backend/src/__tests__/routes/product.routes.test.ts
import request from 'supertest';
import express from 'express';
import productRoutes from '../../routes/product.routes';

const app = express();
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  it('GET /api/products should return 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd apps/backend && npm test src/__tests__/routes/product.routes.test.ts`
Expected: FAIL due to missing files.

**Step 3: Write minimal implementation**

```typescript
// apps/backend/src/controllers/product.controller.ts
import { Request, Response } from 'express';

export const getProducts = async (req: Request, res: Response) => {
  res.status(200).json({ data: [], pagination: {} });
};
```

```typescript
// apps/backend/src/routes/product.routes.ts
import { Router } from 'express';
import { getProducts } from '../controllers/product.controller';

const router = Router();
router.get('/', getProducts);

export default router;
```

**Step 4: Run test to verify it passes**

Run: `cd apps/backend && npm test src/__tests__/routes/product.routes.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/backend/src/routes/product.routes.ts apps/backend/src/controllers/product.controller.ts apps/backend/src/__tests__/routes/product.routes.test.ts
git commit -m "feat(api): add product listing endpoint wrapper and tests"
```

### Task 2: Product Listing Service & Schema Validation

**Files:**
- Create: `apps/backend/src/services/product.service.ts`
- Create: `apps/backend/src/schemas/product.schema.ts`
- Modify: `apps/backend/src/controllers/product.controller.ts`
- Modify: `apps/backend/src/__tests__/routes/product.routes.test.ts`

**Step 1: Write the failing test for query parsing**

```typescript
// Add to apps/backend/src/__tests__/routes/product.routes.test.ts
  it('GET /api/products should return 400 on invalid pagination limit', async () => {
    const res = await request(app).get('/api/products?limit=abc');
    expect(res.status).toBe(400);
  });
```

**Step 2: Run test to verify it fails**

Run: `cd apps/backend && npm test`
Expected: FAIL 

**Step 3: Write minimal implementation**

```typescript
// apps/backend/src/schemas/product.schema.ts
import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
  categorySlug: z.string().optional(),
});
```

```typescript
// apps/backend/src/services/product.service.ts
import prisma from '../prisma/client'; // Adjust import based on actual client location

export const findProducts = async (filters: { q?: string; categorySlug?: string; page: number; limit: number }) => {
  const skip = (filters.page - 1) * filters.limit;
  const where: any = { isActive: true };
  
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } }
    ];
  }
  if (filters.categorySlug) {
    where.categories = { some: { category: { slug: filters.categorySlug } } };
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: filters.limit }),
    prisma.product.count({ where })
  ]);

  return { data, total };
};
```

```typescript
// Modify: apps/backend/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { getProductsQuerySchema } from '../schemas/product.schema';
import * as ProductService from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const validatedQuery = getProductsQuerySchema.parse(req.query);
    const result = await ProductService.findProducts(validatedQuery);
    
    res.status(200).json({
      data: result.data,
      pagination: {
        total: result.total,
        page: validatedQuery.page,
        totalPages: Math.ceil(result.total / validatedQuery.limit)
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
```

**Step 4: Run test to verify it passes**

Run: `cd apps/backend && npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/backend/src/schemas/product.schema.ts apps/backend/src/services/product.service.ts apps/backend/src/controllers/product.controller.ts apps/backend/src/__tests__/routes/product.routes.test.ts
git commit -m "feat(api): implement product listing service and zod schema validation"
```

### Task 3: Product Details Endpoint (/:slug)

**Files:**
- Modify: `apps/backend/src/routes/product.routes.ts`
- Modify: `apps/backend/src/controllers/product.controller.ts`
- Modify: `apps/backend/src/services/product.service.ts`
- Modify: `apps/backend/src/__tests__/routes/product.routes.test.ts`

*(Similar exhaustive step-by-step TDD process for fetching by slug with 404 error testing and nested Prisma includes)*

### Task 4: Categories Endpoint Wrapper & Service

**Files:**
- Create: `apps/backend/src/routes/category.routes.ts`
- Create: `apps/backend/src/controllers/category.controller.ts`
- Create: `apps/backend/src/services/category.service.ts`
- Create: `apps/backend/src/__tests__/routes/category.routes.test.ts`

*(Implement GET /api/categories fetching flat or nested active categories with TDD)*
