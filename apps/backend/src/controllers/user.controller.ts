import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await UserService.register(email, password, firstName, lastName);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await UserService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    const result = await UserService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    // In a real app we might fetch fresh data from DB, but token data works for now
    // Actually we should fetch to get latest names etc
    const { prisma } = await import('../lib/prisma.js');
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = dbUser;
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { firstName, lastName } = req.body;
    const { prisma } = await import('../lib/prisma.js');
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { firstName, lastName }
    });
    
    const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = updatedUser;
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};
