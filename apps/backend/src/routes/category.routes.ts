import express from 'express';
import {
  getCategories,
  getTopCategoriesByProductCount,
  getCategoryFilters,
} from '../controllers/category.controller.js';

const router: express.Router = express.Router();
router.get('/', getCategories);
router.get('/top', getTopCategoriesByProductCount);
router.get('/:slug/filters', getCategoryFilters);  // must be after /top

export default router;
