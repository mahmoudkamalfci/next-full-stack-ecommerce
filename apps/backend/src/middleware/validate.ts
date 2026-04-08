import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BadRequestError } from './errorHandler.js';

/**
 * Middleware to validate request bodies using Zod schemas.
 * 
 * @param schema The Zod schema to validate against.
 */
export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Return only the first error message for simplicity
        const message = error.issues[0]?.message || 'Validation failed';
        next(new BadRequestError(message));
      } else {
        next(error);
      }
    }
  };
