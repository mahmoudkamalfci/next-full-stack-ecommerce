import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { mockPrisma } from '../mocks/prisma.mock.js';
import { globalErrorHandler } from '../../middleware/errorHandler.js';

jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

const { default: categoryRoutes } = await import('../../routes/category.routes.js');

const app = express();
app.use('/api/categories', categoryRoutes);
app.use(globalErrorHandler);

describe('Category Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return 200 with active categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Electronics', slug: 'electronics' },
        { id: '2', name: 'Clothing', slug: 'clothing' }
      ];
      
      (mockPrisma.category.findMany as any).mockResolvedValue(mockCategories);

      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: mockCategories });
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {
          children: true
        }
      });
    });

    it('should handle internal server errors', async () => {
      (mockPrisma.category.findMany as any).mockRejectedValue(new Error('DB Error'));

      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ status: 'error', message: 'Internal server error' });
    });
  });
});
