import { Request, Response, NextFunction } from 'express';
import * as CategoryService from '../services/category.service.js';
import { categorySlugParamSchema, getCategoriesQuerySchema } from '../schemas/category.schema.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = getCategoriesQuerySchema.parse(req.query);
    const categories = await CategoryService.getCategories(validatedQuery);
    res.status(200).json({ data: categories });
  } catch (error: any) {
    next(error);
  }
};

export const getTopCategoriesByProductCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getTopCategoriesByProductCount();
    res.status(200).json({ data: categories });
  } catch (error: any) {
    next(error);
  }
};

export const getCategoryFilters = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = categorySlugParamSchema.parse(req.params);
    const filters = await CategoryService.getCategoryFilters(slug);
    res.status(200).json({ data: filters });
  } catch (error: any) {
    next(error);
  }
};
