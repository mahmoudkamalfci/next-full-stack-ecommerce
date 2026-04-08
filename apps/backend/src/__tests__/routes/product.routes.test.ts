import request from 'supertest';
import express from 'express';
import productRoutes from '../../routes/product.routes';

const app = express();
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  it('GET /api/products should return 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
  });
});
