import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    throw new UnauthorizedError('Access denied');
  }
  
  try {
    const verified = jwt.verify(token, config.jwtSecret);
    (req as any).user = verified;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};

export const authorizeRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (!user || !roles.includes(user.role)) {
    throw new ForbiddenError();
  }
  next();
};
