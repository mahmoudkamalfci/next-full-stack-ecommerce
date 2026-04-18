import express from 'express';
import { getCategories, getTopCategoriesByProductCount } from '../controllers/category.controller.js';

const router: express.Router = express.Router();
router.get('/', getCategories);
router.get('/top', getTopCategoriesByProductCount);

export default router;
