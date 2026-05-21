import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export const cartRouter: Router = Router();

cartRouter.post('/items', authenticateToken, cartController.addItem);
cartRouter.get('/', authenticateToken, cartController.getCart);
cartRouter.post('/merge', authenticateToken, cartController.mergeCart);
