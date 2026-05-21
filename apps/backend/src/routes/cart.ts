import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { authMiddleware } from '../middleware/auth.js';

export const cartRouter: Router = Router();

cartRouter.post('/items', authMiddleware, cartController.addItem);
cartRouter.get('/', authMiddleware, cartController.getCart);
cartRouter.post('/merge', authMiddleware, cartController.mergeCart);
