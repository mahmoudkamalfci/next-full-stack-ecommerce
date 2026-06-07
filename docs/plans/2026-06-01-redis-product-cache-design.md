# Redis Product Cache — Design Document

**Date:** 2026-06-01  
**Status:** Approved  
**Feature:** Eliminate DB queries from `getCart` using a Redis product variant cache with explicit invalidation

---

## Problem

`getCart` in `cart.service.ts` calls `prisma.productVariant.findMany(...)` on every cart read — including after every add, update, remove, merge, and sync. This is a deep join across `ProductVariant → Product → Images + OptionValues → Options`, hitting the DB on every hot-path cart operation.

The cart quantity data is already stored in Redis, but the product enrichment data still requires a DB round-trip every time.

---

## Goal

Make `getCart` a pure Redis operation on warm cache. DB is only touched on cache miss (first time a variant is added to any cart), and on explicit invalidation triggered by admin product updates.

---

## Chosen Approach: Read-Through Cache + Redis Set Index

### Redis Key Schema

| Key | Type | Content |
|-----|------|---------|
| `cart:{userId}` | Hash | `{ variantId: quantity }` — existing |
| `product:variant:{variantId}` | String (JSON) | Enriched variant snapshot |
| `product:variants:{productId}` | Set | All variantIds belonging to this product |

### Cached Variant JSON Shape

```json
{
  "id": "42",
  "sku": "SHIRT-RED-M",
  "name": "Classic T-Shirt",
  "price": 29.99,
  "image": "https://cdn.example.com/shirt-red.jpg",
  "size": "M",
  "color": "Red"
}
```

---

## Data Flow

### `getCart` (hot path)

```
1. Redis HGETALL cart:{userId}              → { variantId: quantity, ... }
2. Redis MGET product:variant:{id}...       → batch fetch all cached variants
3. On MISS (any missing variantIds):
     → Prisma findMany for missing ids only
     → Redis SET product:variant:{id} JSON   (populate cache)
     → Redis SADD product:variants:{productId} variantId  (build index)
4. Merge quantities + data → return CartItemDTO[]
```

### Cache Miss Strategy

- Only fetch **missing** variant IDs from Prisma — partial misses don't cause a full DB query
- On first ever request for a variant, DB is hit once. All subsequent reads are Redis only.

### Invalidation: Admin updates a product (name, images)

```
1. Prisma update Product
2. Redis SMEMBERS product:variants:{productId}    → get all variantIds
3. Redis DEL product:variant:{variantId}...       → invalidate each variant cache
   (next getCart will re-populate from DB)
```

### Invalidation: Admin updates a specific variant (price, SKU)

```
1. Prisma update ProductVariant
2. Redis DEL product:variant:{variantId}          → invalidate just that key
```

---

## New Service: `product-cache.service.ts`

Encapsulates all caching logic. Neither `cart.service.ts` nor future admin product services know Redis internals directly.

**Public API:**

```typescript
getVariantCacheBatch(variantIds: number[]): Promise<Map<number, CartItemDTO | null>>
setVariantCache(variant: PrismaVariantWithRelations): Promise<void>
invalidateVariant(variantId: number): Promise<void>
invalidateProductVariants(productId: number): Promise<void>
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Redis unavailable on `getCart` | Fall back to full Prisma query (graceful degradation) |
| Cache miss on `getCart` | Re-fetch from Prisma, re-populate cache |
| Partial MGET miss | Only missing variant IDs fetched from DB |
| `product:variants:{productId}` Set out of sync | `DEL product:variant:{id}` is always safe — worst case is a re-fetch |
| Redis unavailable on invalidation | Log warning; DB is still updated; cache will self-heal on next miss |

---

## Files Touched

| Action | File |
|--------|------|
| **Create** | `apps/backend/src/services/product-cache.service.ts` |
| **Modify** | `apps/backend/src/services/cart.service.ts` |
| **Future hook** | `apps/backend/src/services/product.service.ts` (when update mutations are added) |

---

## Non-Goals (Out of Scope)

- TTL on variant cache keys (explicit invalidation is chosen)
- Guest cart caching (guest carts live in frontend Zustand store only)
- Caching full product listings or product page data (separate concern)
