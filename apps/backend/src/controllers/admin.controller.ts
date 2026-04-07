import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, updatedAt: true }
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id || '';
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, updatedAt: true }
    });
    if (!user) throw new NotFoundError('User not found');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id || '';
    const user = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
    if (!user) throw new NotFoundError('User not found');

    await prisma.user.delete({ where: { id: parseInt(id, 10) } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
