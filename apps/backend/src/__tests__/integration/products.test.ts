import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { mockPrisma } from '../mocks/prisma.mock.js';

// Mock the prisma module BEFORE importing the app
jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

// Dynamic import AFTER the mock is set up (required for ESM mocking)
const { app } = await import('../../index.js');

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  // ─── GET /api/products ──────────────────────────────────────────

  describe('GET /api/products', () => {
    it('should return 200 with a products message', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: 'products' });
    });
  });

  // ─── GET /api/products/:slug ────────────────────────────────────

  describe('GET /api/products/:slug', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      description: 'A great product',
      categories: [
        {
          category: { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
        },
      ],
      options: [
        {
          id: 'opt-1',
          name: 'Color',
          values: [
            { id: 'val-1', value: 'Red' },
            { id: 'val-2', value: 'Blue' },
          ],
        },
      ],
      variants: [
        {
          id: 'var-1',
          sku: 'TEST-001',
          optionValues: [
            { optionValue: { id: 'val-1', value: 'Red' } },
          ],
        },
      ],
    };

    it('should return 200 with the product when found', async () => {
      (mockPrisma.product.findUnique as any).mockResolvedValue(mockProduct);

      const res = await request(app).get('/api/products/test-product');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProduct);
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
        include: {
          categories: { include: { category: true } },
          options: {
            include: { values: true },
          },
          variants: {
            include: {
              optionValues: {
                include: { optionValue: true },
              },
            },
          },
        },
      });
    });

    it('should return 404 when the product is not found', async () => {
      (mockPrisma.product.findUnique as any).mockResolvedValue(null);

      const res = await request(app).get('/api/products/non-existent');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });

    it('should return 500 when there is a database error', async () => {
      (mockPrisma.product.findUnique as any).mockRejectedValue(
        new Error('Database connection failed')
      );

      const res = await request(app).get('/api/products/test-product');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch product' });
    });
  });
});
