import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { mockPrisma } from '../mocks/prisma.mock.js';

// ─── Setup Mock Redis ────────────────────────────────────────────────────────
const mockRedis = {
  hGetAll: jest.fn<any>(),
  mGet: jest.fn<any>(),
  set: jest.fn<any>(),
  sAdd: jest.fn<any>(),
  del: jest.fn<any>(),
  sMembers: jest.fn<any>(),
  hIncrBy: jest.fn<any>(),
  hSet: jest.fn<any>(),
  hDel: jest.fn<any>(),
  on: jest.fn<any>(),
};

// Mock prisma and redis BEFORE importing services
jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

jest.unstable_mockModule('../../lib/redis.js', () => ({
  default: mockRedis,
}));

// Dynamic imports after mocking modules
const { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } = await import('../../services/cart.service.js');
const { getVariantCacheBatch, setVariantCache, invalidateVariant, invalidateProductVariants } = await import('../../services/product-cache.service.js');

describe('Redis Product Cache & Cart Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('product-cache.service', () => {
    it('getVariantCacheBatch returns Map of items and nulls', async () => {
      mockRedis.mGet.mockResolvedValue([
        JSON.stringify({ id: '1', name: 'Cached Product', price: 100 }),
        null,
      ]);

      const result = await getVariantCacheBatch([1, 2]);

      expect(mockRedis.mGet).toHaveBeenCalledWith(['product:variant:1', 'product:variant:2']);
      expect(result.get(1)).toEqual({ id: '1', name: 'Cached Product', price: 100 });
      expect(result.get(2)).toBeNull();
    });

    it('setVariantCache sets variant details and adds to product variant index set', async () => {
      const mockVariant = {
        id: 10,
        sku: 'SKU10',
        price: 99.9,
        product: { id: 5, name: 'T-Shirt', images: [{ imageUrl: 'prod.jpg' }] },
        images: [{ imageUrl: 'var.jpg' }],
        optionValues: [
          { optionValue: { option: { name: 'Size' }, value: 'L' } },
          { optionValue: { option: { name: 'Color' }, value: 'Red' } },
        ],
      };

      mockRedis.set.mockResolvedValue('OK');
      mockRedis.sAdd.mockResolvedValue(1);

      await setVariantCache(mockVariant);

      expect(mockRedis.set).toHaveBeenCalledWith(
        'product:variant:10',
        JSON.stringify({
          id: '10',
          sku: 'SKU10',
          name: 'T-Shirt',
          price: 99.9,
          image: 'var.jpg',
          size: 'L',
          color: 'Red',
        })
      );
      expect(mockRedis.sAdd).toHaveBeenCalledWith('product:variants:5', '10');
    });

    it('invalidateVariant deletes the variant key', async () => {
      mockRedis.del.mockResolvedValue(1);
      await invalidateVariant(10);
      expect(mockRedis.del).toHaveBeenCalledWith('product:variant:10');
    });

    it('invalidateProductVariants deletes all variant keys associated with a product', async () => {
      mockRedis.sMembers.mockResolvedValue(['10', '11']);
      mockRedis.del.mockResolvedValue(2);

      await invalidateProductVariants(5);

      expect(mockRedis.sMembers).toHaveBeenCalledWith('product:variants:5');
      expect(mockRedis.del).toHaveBeenCalledWith(['product:variant:10', 'product:variant:11']);
    });
  });

  describe('cart.service with cache integration', () => {
    it('returns empty array when cart has no items', async () => {
      mockRedis.hGetAll.mockResolvedValue({});
      const result = await getCart('user1');
      expect(result).toEqual([]);
    });

    it('returns fully cached items from Redis without calling Prisma', async () => {
      mockRedis.hGetAll.mockResolvedValue({ '10': '2' });
      mockRedis.mGet.mockResolvedValue([
        JSON.stringify({
          id: '10',
          sku: 'SKU10',
          name: 'T-Shirt',
          price: 99.9,
          image: 'var.jpg',
          size: 'L',
          color: 'Red',
        }),
      ]);

      const result = await getCart('user1');

      expect(result).toEqual([
        {
          id: '10',
          sku: 'SKU10',
          name: 'T-Shirt',
          price: 99.9,
          image: 'var.jpg',
          size: 'L',
          color: 'Red',
          quantity: 2,
        },
      ]);
      expect(mockPrisma.productVariant.findMany).not.toHaveBeenCalled();
    });

    it('handles partial cache misses: fetches miss from DB, caches it, and returns combined result', async () => {
      mockRedis.hGetAll.mockResolvedValue({ '10': '2', '20': '1' });
      // 10 is cached, 20 is a miss
      mockRedis.mGet.mockResolvedValue([
        JSON.stringify({
          id: '10',
          sku: 'SKU10',
          name: 'T-Shirt',
          price: 99.9,
          image: 'var.jpg',
          size: 'L',
          color: 'Red',
        }),
        null,
      ]);

      const mockDbVariant = {
        id: 20,
        sku: 'SKU20',
        price: 49.9,
        product: { id: 6, name: 'Jeans', images: [] },
        images: [{ imageUrl: 'jeans.jpg' }],
        optionValues: [
          { optionValue: { option: { name: 'Size' }, value: '32' } },
        ],
      };

      (mockPrisma.productVariant.findMany as any).mockResolvedValue([mockDbVariant]);
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.sAdd.mockResolvedValue(1);

      const result = await getCart('user1');

      // Verify Prisma was called ONLY for the missing ID
      expect(mockPrisma.productVariant.findMany).toHaveBeenCalledWith({
        where: { id: { in: [20] } },
        include: expect.any(Object),
      });

      // Verify cache was populated for the miss
      expect(mockRedis.set).toHaveBeenCalledWith(
        'product:variant:20',
        expect.any(String)
      );

      // Verify returned combined data
      expect(result).toEqual([
        {
          id: '10',
          sku: 'SKU10',
          name: 'T-Shirt',
          price: 99.9,
          image: 'var.jpg',
          size: 'L',
          color: 'Red',
          quantity: 2,
        },
        {
          id: '20',
          sku: 'SKU20',
          name: 'Jeans',
          price: 49.9,
          image: 'jeans.jpg',
          size: '32',
          color: '',
          quantity: 1,
        },
      ]);
    });

    it('gracefully degrades to direct DB query when Redis cache check throws an error', async () => {
      mockRedis.hGetAll.mockResolvedValue({ '10': '2' });
      mockRedis.mGet.mockRejectedValue(new Error('Redis connection lost'));

      const mockDbVariant = {
        id: 10,
        sku: 'SKU10',
        price: 99.9,
        product: { id: 5, name: 'T-Shirt', images: [{ imageUrl: 'prod.jpg' }] },
        images: [{ imageUrl: 'var.jpg' }],
        optionValues: [
          { optionValue: { option: { name: 'Size' }, value: 'L' } },
        ],
      };
      (mockPrisma.productVariant.findMany as any).mockResolvedValue([mockDbVariant]);

      const result = await getCart('user1');

      // Verify Prisma fallback worked
      expect(mockPrisma.productVariant.findMany).toHaveBeenCalledWith({
        where: { id: { in: [10] } },
        include: expect.any(Object),
      });
      expect(result).toEqual([
        {
          id: '10',
          sku: 'SKU10',
          name: 'T-Shirt',
          price: 99.9,
          image: 'var.jpg',
          size: 'L',
          color: '',
          quantity: 2,
        },
      ]);
    });
  });
});
