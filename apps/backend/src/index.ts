import express, { type Express } from 'express';

import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';
import { cartRouter } from './routes/cart.js';
import { checkoutRouter } from './routes/checkout.js';
import { userRouter } from './routes/user.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

export const app: Express = express();

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

// --- Error handling (must be registered AFTER all routes) ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Only start listening when this file is run directly (not imported by tests)
const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
