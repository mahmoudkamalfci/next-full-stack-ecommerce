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
    variant.images?.[0]?.imageUrl ||
    variant.product?.images?.[0]?.imageUrl ||
    '';

  let size = '';
  let color = '';
  if (variant.optionValues) {
    variant.optionValues.forEach((ov: any) => {
      const name = ov.optionValue?.option?.name?.toLowerCase() || '';
      if (name.includes('size')) size = ov.optionValue?.value || '';
      if (name.includes('color')) color = ov.optionValue?.value || '';
    });
  }

  return {
    id: variant.id.toString(),
    sku: variant.sku,
    name: variant.product?.name || '',
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

  const keysToDelete = variantIds.map((id: any) => variantKey(Number(id)));
  await redisClient.del(keysToDelete);
  // Keep the index intact so future invalidations still work.
  // The index entries will be overwritten next time setVariantCache is called.
}
