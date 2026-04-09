import { Request, Response, NextFunction } from 'express';
import { getProductsQuerySchema } from '../schemas/product.schema.js';
import * as ProductService from '../services/product.service.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = getProductsQuerySchema.parse(req.query);
    const result = await ProductService.findProducts(validatedQuery);
    
    res.status(200).json({
      data: result.data,
      pagination: {
        total: result.total,
        page: validatedQuery.page,
        totalPages: Math.ceil(result.total / validatedQuery.limit)
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const product = await ProductService.getProductBySlug(slug);
    
    if (!product) {
      return next(new NotFoundError('Product not found'));
    }
    
    res.status(200).json({ data: product });
  } catch (error: any) {
    next(error);
  }
};
