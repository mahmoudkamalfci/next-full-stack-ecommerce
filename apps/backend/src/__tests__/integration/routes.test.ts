import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { mockPrisma } from '../mocks/prisma.mock.js';

// Mock the prisma module BEFORE importing the app
jest.unstable_mockModule('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

// Dynamic import AFTER the mock is set up (required for ESM mocking)
const { app } = await import('../../index.js');

describe('General Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  // ─── GET / (health check) ───────────────────────────────────────

  describe('GET /', () => {
    it('should return "Hello from Backend!"', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.text).toBe('Hello from Backend!');
    });
  });

  // ─── GET /api/categories ────────────────────────────────────────

  describe('GET /api/categories', () => {
    it('should return 200 with categories message', async () => {
      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: 'categories' });
    });
  });

  // ─── GET /api/cart ──────────────────────────────────────────────

  describe('GET /api/cart', () => {
    it('should return 200 with cart message', async () => {
      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: 'cart' });
    });
  });

  // ─── GET /api/checkout ──────────────────────────────────────────

  describe('GET /api/checkout', () => {
    it('should return 200 with checkout message', async () => {
      const res = await request(app).get('/api/checkout');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: 'checkout' });
    });
  });

  // ─── 404 Not Found ─────────────────────────────────────────────

  describe('Unknown routes', () => {
    it('should return 404 with structured error for unknown GET routes', async () => {
      const res = await request(app).get('/api/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Cannot GET /api/nonexistent',
      });
    });

    it('should return 404 with structured error for unknown POST routes', async () => {
      const res = await request(app).post('/api/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Cannot POST /api/nonexistent',
      });
    });
  });
});
