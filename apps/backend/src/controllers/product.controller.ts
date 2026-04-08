import { Request, Response } from 'express';
import { getProductsQuerySchema } from '../schemas/product.schema.js';
import * as ProductService from '../services/product.service.js';

export const getProducts = async (req: Request, res: Response) => {
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
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Controller Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const getProductBySlug = async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await ProductService.getProductBySlug(slug);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({ data: product });
  } catch (error: any) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
