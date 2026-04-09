import { Request, Response, NextFunction } from 'express';
import * as CategoryService from '../services/category.service.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getCategories();
    res.status(200).json({ data: categories });
  } catch (error: any) {
    next(error);
  }
};
