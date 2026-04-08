import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockPrisma } from '../mocks/prisma.mock.js';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

const { default: productRoutes } = await import('../../routes/product.routes.js');

const app = express();
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockPrisma.product.findMany as any).mockResolvedValue([]);
    (mockPrisma.product.count as any).mockResolvedValue(0);
  });
  it('GET /api/products should return 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
  });

  it('GET /api/products should return 400 on invalid pagination limit', async () => {
    const res = await request(app).get('/api/products?limit=abc');
    expect(res.status).toBe(400);
  });

  describe('GET /api/products/:slug', () => {
    it('should return 404 when product is not found', async () => {
      (mockPrisma.product.findUnique as any).mockResolvedValue(null);
      const res = await request(app).get('/api/products/non-existent');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });

    it('should return 200 with the product when found', async () => {
      const mockProduct = { id: '1', slug: 'test-product', name: 'Test' };
      (mockPrisma.product.findUnique as any).mockResolvedValue(mockProduct);
      const res = await request(app).get('/api/products/test-product');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: mockProduct });
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product', isActive: true },
        include: {
          categories: { include: { category: true } },
          options: { include: { values: true } },
          variants: { include: { optionValues: { include: { optionValue: true } } } }
        }
      });
    });
  });
});
