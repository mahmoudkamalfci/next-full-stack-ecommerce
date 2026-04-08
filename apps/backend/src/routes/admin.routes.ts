import { Router } from 'express';
import { getAllUsers, getUserById, deleteUser } from '../controllers/admin.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

export const adminRouter: Router = Router();

// Apply auth and admin role check to all routes in this router
adminRouter.use(authenticateToken, authorizeRole(['ADMIN']));

adminRouter.get('/users', getAllUsers);
adminRouter.get('/users/:id', getUserById);
adminRouter.delete('/users/:id', deleteUser);
