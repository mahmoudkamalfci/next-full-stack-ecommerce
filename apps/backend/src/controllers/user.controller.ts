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
    const safeUser = await UserService.getProfile(user.id);
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { firstName, lastName } = req.body;
    const safeUser = await UserService.updateProfile(user.id, { firstName, lastName });
    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};
