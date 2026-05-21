import type { Request, Response } from 'express';
import * as cartService from '../services/cart.service.js';

export const addItem = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = (req as any).user.id;
  const cart = await cartService.addCartItem(userId, productId, quantity);
  res.json(cart);
};

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const cart = await cartService.getCart(userId);
  res.json(cart);
};

export const mergeCart = async (req: Request, res: Response) => {
  const { guestItems } = req.body;
  const userId = (req as any).user.id;
  const cart = await cartService.mergeCart(userId, guestItems);
  res.json(cart);
};
