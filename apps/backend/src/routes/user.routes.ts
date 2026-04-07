import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getProfile, updateProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';

export const userRouter: Router = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

userRouter.get('/me', authenticateToken, getProfile);
userRouter.put('/me', authenticateToken, updateProfile);
