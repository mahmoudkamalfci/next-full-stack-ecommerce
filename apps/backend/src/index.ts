import express from 'express';

import { prisma } from './lib/prisma.js';
import { productRouter } from './routes/products.js';
import { categoryRouter } from './routes/categories.js';
import { cartRouter } from './routes/cart.js';
import { checkoutRouter } from './routes/checkout.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
