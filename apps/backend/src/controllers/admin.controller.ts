import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id || '';
    const user = await AdminService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id || '';
    const result = await AdminService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
