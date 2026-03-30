import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
