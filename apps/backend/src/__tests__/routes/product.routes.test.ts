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
});
