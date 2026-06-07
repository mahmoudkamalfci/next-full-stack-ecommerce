# Redis Product Cache Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate Prisma DB queries from `getCart` by caching enriched variant data in Redis with explicit invalidation via a product→variants Set index.

**Architecture:** A new `product-cache.service.ts` handles all Redis caching logic. `cart.service.ts` is updated to use `MGET` batch reads from the cache, falling back to Prisma only on misses. Future admin product update endpoints will call `invalidateVariant` / `invalidateProductVariants` to bust stale cache entries.

**Tech Stack:** Node.js, TypeScript, Express, Redis (`node-redis`), Prisma (PostgreSQL)

---

## Task 1: Create `product-cache.service.ts`

**Files:**
- Create: `apps/backend/src/services/product-cache.service.ts`

This service is the heart of the feature. It exposes four functions and owns all Redis key naming.

**Step 1: Create the file with full implementation**

```typescript
// apps/backend/src/services/product-cache.service.ts
import redisClient from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';

// ─── Key helpers ────────────────────────────────────────────────────────────
const variantKey = (variantId: number) => `product:variant:${variantId}`;
const productVariantsKey = (productId: number) => `product:variants:${productId}`;

// ─── Types ──────────────────────────────────────────────────────────────────
export interface CachedCartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

/** Build a CachedCartItem from a Prisma variant with full relations */
function buildCachePayload(variant: any): CachedCartItem {
  const image =
    variant.images[0]?.imageUrl ||
    variant.product.images[0]?.imageUrl ||
    '';

  let size = '';
  let color = '';
  variant.optionValues.forEach((ov: any) => {
    const name = ov.optionValue.option.name.toLowerCase();
    if (name.includes('size')) size = ov.optionValue.value;
    if (name.includes('color')) color = ov.optionValue.value;
  });

  return {
    id: variant.id.toString(),
    sku: variant.sku,
    name: variant.product.name,
    price: Number(variant.price),
    image,
    size,
    color,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Batch-fetch cached variant data from Redis.
 * Returns a Map of variantId → CachedCartItem | null (null = cache miss).
 */
export async function getVariantCacheBatch(
  variantIds: number[]
): Promise<Map<number, CachedCartItem | null>> {
  const result = new Map<number, CachedCartItem | null>();
  if (variantIds.length === 0) return result;

  const keys = variantIds.map(variantKey);
  const values = await redisClient.mGet(keys);

  variantIds.forEach((id, i) => {
    const raw = values[i];
    result.set(id, raw ? (JSON.parse(raw) as CachedCartItem) : null);
  });

  return result;
}

/**
 * Persist a single variant's enriched data into Redis.
 * Also registers the variantId in the product→variants Set index.
 * Accepts a raw Prisma variant with all required relations included.
 */
export async function setVariantCache(variant: any): Promise<void> {
  const payload = buildCachePayload(variant);
  await Promise.all([
    redisClient.set(variantKey(variant.id), JSON.stringify(payload)),
    redisClient.sAdd(productVariantsKey(variant.product.id), variant.id.toString()),
  ]);
}

/**
 * Invalidate a single cached variant (e.g., when admin updates a variant's price/SKU).
 */
export async function invalidateVariant(variantId: number): Promise<void> {
  await redisClient.del(variantKey(variantId));
}

/**
 * Invalidate all cached variants for a product (e.g., when admin updates product name/images).
 * Uses the product:variants:{productId} Set index — no SCAN needed.
 */
export async function invalidateProductVariants(productId: number): Promise<void> {
  const indexKey = productVariantsKey(productId);
  const variantIds = await redisClient.sMembers(indexKey);
  if (variantIds.length === 0) return;

  const keysToDelete = variantIds.map((id) => variantKey(Number(id)));
  await redisClient.del(keysToDelete);
  // Keep the index intact so future invalidations still work.
  // The index entries will be overwritten next time setVariantCache is called.
}
```

**Step 2: Verify the file was created with no TypeScript errors**

```bash
cd apps/backend && npx tsc --noEmit 2>&1 | head -40
```

Expected: No errors (or only pre-existing errors unrelated to this file).

**Step 3: Commit**

```bash
git add apps/backend/src/services/product-cache.service.ts
git commit -m "feat(cache): add product-cache.service with Redis variant cache and invalidation"
```

---

## Task 2: Refactor `cart.service.ts` to use the cache

**Files:**
- Modify: `apps/backend/src/services/cart.service.ts`

Remove the `prisma.productVariant.findMany` call from `getCart`. Replace it with a `MGET` batch read from the product cache, falling back to Prisma only on misses.

**Step 1: Replace the full contents of `cart.service.ts`**

```typescript
// apps/backend/src/services/cart.service.ts
import redisClient from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import {
  getVariantCacheBatch,
  setVariantCache,
  type CachedCartItem,
} from './product-cache.service.js';

// ─── Prisma include shape used for cache population ──────────────────────────
const VARIANT_INCLUDE = {
  product: { include: { images: true } },
  optionValues: {
    include: {
      optionValue: { include: { option: true } },
    },
  },
  images: true,
} as const;

export const addCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const key = `cart:${userId}`;
  await redisClient.hIncrBy(key, productId, quantity);
  return getCart(userId);
};

export const getCart = async (userId: string) => {
  const key = `cart:${userId}`;
  const rawCart = await redisClient.hGetAll(key);

  const variantIds = Object.keys(rawCart)
    .map(Number)
    .filter((id) => !isNaN(id));

  if (variantIds.length === 0) return [];

  // ── 1. Batch-read from Redis cache ────────────────────────────────────────
  let cacheMap: Map<number, CachedCartItem | null>;
  try {
    cacheMap = await getVariantCacheBatch(variantIds);
  } catch (err) {
    // Redis failure: fall back to full Prisma query (graceful degradation)
    console.warn('[cart] Redis unavailable, falling back to DB:', err);
    return getCartFromDB(userId, variantIds, rawCart);
  }

  // ── 2. Determine cache misses ─────────────────────────────────────────────
  const missIds = variantIds.filter((id) => cacheMap.get(id) === null);

  // ── 3. Fetch only missing variants from Prisma ───────────────────────────
  if (missIds.length > 0) {
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: missIds } },
      include: VARIANT_INCLUDE,
    });

    // Populate cache for each miss
    await Promise.all(variants.map((v) => setVariantCache(v)));

    // Update cacheMap with freshly fetched data
    variants.forEach((v) => {
      // setVariantCache builds the payload — re-use buildCachePayload indirectly
      // by reading back what we just stored, or inline it here:
      const image =
        v.images[0]?.imageUrl || v.product.images[0]?.imageUrl || '';
      let size = '';
      let color = '';
      (v.optionValues as any[]).forEach((ov) => {
        const name = ov.optionValue.option.name.toLowerCase();
        if (name.includes('size')) size = ov.optionValue.value;
        if (name.includes('color')) color = ov.optionValue.value;
      });
      cacheMap.set(v.id, {
        id: v.id.toString(),
        sku: v.sku,
        name: v.product.name,
        price: Number(v.price),
        image,
        size,
        color,
      });
    });
  }

  // ── 4. Assemble final cart items ──────────────────────────────────────────
  return variantIds
    .map((id) => {
      const cached = cacheMap.get(id);
      if (!cached) return null; // variant not found in DB either — skip
      return {
        ...cached,
        quantity: parseInt(rawCart[id.toString()] || '1'),
      };
    })
    .filter(Boolean);
};

/** Fallback: full Prisma query when Redis is unavailable */
async function getCartFromDB(
  _userId: string,
  variantIds: number[],
  rawCart: Record<string, string>
) {
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: VARIANT_INCLUDE,
  });

  return variants.map((variant) => {
    const quantity = parseInt(rawCart[variant.id.toString()] || '1');
    const image =
      variant.images[0]?.imageUrl ||
      variant.product.images[0]?.imageUrl ||
      '';
    let size = '';
    let color = '';
    (variant.optionValues as any[]).forEach((ov) => {
      const name = ov.optionValue.option.name.toLowerCase();
      if (name.includes('size')) size = ov.optionValue.value;
      if (name.includes('color')) color = ov.optionValue.value;
    });
    return {
      id: variant.id.toString(),
      sku: variant.sku,
      name: variant.product.name,
      price: Number(variant.price),
      image,
      quantity,
      size,
      color,
    };
  });
}

export const mergeCart = async (
  userId: string,
  guestItems: { productId: string; quantity: number }[]
) => {
  const key = `cart:${userId}`;
  for (const item of guestItems) {
    await redisClient.hIncrBy(key, item.productId, item.quantity);
  }
  return getCart(userId);
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const key = `cart:${userId}`;
  if (quantity <= 0) {
    await redisClient.hDel(key, productId);
  } else {
    await redisClient.hSet(key, productId, quantity);
  }
  return getCart(userId);
};

export const removeCartItem = async (userId: string, productId: string) => {
  const key = `cart:${userId}`;
  await redisClient.hDel(key, productId);
  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  const key = `cart:${userId}`;
  await redisClient.del(key);
  return [];
};
```

**Step 2: Verify no TypeScript errors**

```bash
cd apps/backend && npx tsc --noEmit 2>&1 | head -40
```

Expected: No new errors.

**Step 3: Smoke test — start the server and verify cart GET works**

```bash
# In one terminal
cd apps/backend && npm run dev

# In another terminal — replace TOKEN and VARIANT_ID with real values
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3001/cart
```

Expected: Cart returns enriched items. Second request should hit Redis only (check Redis with `redis-cli KEYS "product:variant:*"`).

**Step 4: Commit**

```bash
git add apps/backend/src/services/cart.service.ts
git commit -m "feat(cart): use Redis read-through cache in getCart — eliminates DB queries on warm cache"
```

---

## Task 3: Document the future invalidation hook for product updates

**Files:**
- Modify: `apps/backend/src/services/product.service.ts`

Add a comment block at the top of `product.service.ts` so the next developer who adds update/delete mutations knows exactly where to plug in cache invalidation. No code change required yet.

**Step 1: Add the comment block at the top of `product.service.ts` (after existing imports)**

Add after `import { prisma } from '../lib/prisma.js';`:

```typescript
// ─── Cache Invalidation Note ─────────────────────────────────────────────────
// When you add updateProduct / updateVariant / deleteVariant admin mutations:
//
//   import { invalidateProductVariants, invalidateVariant } from './product-cache.service.js';
//
//   On product update (name, images, category):
//     await invalidateProductVariants(productId);
//
//   On variant update (price, SKU, inventory):
//     await invalidateVariant(variantId);
//
//   On product delete:
//     await invalidateProductVariants(productId);
//
// This busts the Redis cache so getCart re-fetches fresh data from DB.
// See docs/plans/2026-06-01-redis-product-cache-design.md for full design.
// ─────────────────────────────────────────────────────────────────────────────
```

**Step 2: Commit**

```bash
git add apps/backend/src/services/product.service.ts
git commit -m "docs(product): add cache invalidation guide for future admin update mutations"
```

---

## Task 4: Manual end-to-end verification

**Step 1: Flush Redis and verify cache population**

```bash
redis-cli FLUSHALL

# Add an item to cart via API (replace values)
curl -X POST http://localhost:3001/cart/items \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "<VARIANT_ID>", "quantity": 1}'

# Check Redis — should now have product:variant:* and product:variants:* keys
redis-cli KEYS "product:*"
redis-cli HGETALL "cart:<USER_ID>"
```

Expected output: Two Redis key patterns present.

**Step 2: Verify second `getCart` makes zero DB queries**

Enable Prisma query logging temporarily in `apps/backend/src/lib/prisma.ts`:

```typescript
export const prisma = new PrismaClient({ log: ['query'] });
```

Then call GET `/cart` twice. First call should log a Prisma query. **Second call should log nothing** — pure Redis.

Restore `prisma.ts` to no logging after verification.

**Step 3: Verify graceful degradation**

```bash
# Stop Redis
redis-cli SHUTDOWN NOSAVE

# GET /cart — should still return data (from DB fallback)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3001/cart
```

Expected: Cart returns correctly with a `[cart] Redis unavailable, falling back to DB:` warning in server logs.

**Step 4: Final commit**

```bash
git add docs/plans/2026-06-01-redis-product-cache-design.md
git commit -m "docs: finalize Redis product cache design and implementation plan"
```
