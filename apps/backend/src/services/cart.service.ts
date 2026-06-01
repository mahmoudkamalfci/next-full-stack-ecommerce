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
      const image =
        v.images?.[0]?.imageUrl || v.product?.images?.[0]?.imageUrl || '';
      let size = '';
      let color = '';
      if (v.optionValues) {
        (v.optionValues as any[]).forEach((ov) => {
          const name = ov.optionValue?.option?.name?.toLowerCase() || '';
          if (name.includes('size')) size = ov.optionValue?.value || '';
          if (name.includes('color')) color = ov.optionValue?.value || '';
        });
      }
      cacheMap.set(v.id, {
        id: v.id.toString(),
        sku: v.sku,
        name: v.product?.name || '',
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
      variant.images?.[0]?.imageUrl ||
      variant.product?.images?.[0]?.imageUrl ||
      '';
    let size = '';
    let color = '';
    if (variant.optionValues) {
      (variant.optionValues as any[]).forEach((ov) => {
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
