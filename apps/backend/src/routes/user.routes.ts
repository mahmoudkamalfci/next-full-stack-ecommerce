import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getProfile, updateProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema
} from '../schemas/user.schema.js';

export const userRouter: Router = Router();

userRouter.post('/register', validate(registerSchema), register);
userRouter.post('/login', validate(loginSchema), login);
userRouter.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
userRouter.post('/reset-password', validate(resetPasswordSchema), resetPassword);

userRouter.get('/me', authenticateToken, getProfile);
userRouter.put('/me', authenticateToken, validate(updateProfileSchema), updateProfile);
