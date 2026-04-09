import express from 'express';
import { getProducts, getProductBySlug } from '../controllers/product.controller.js';

const router: express.Router = express.Router();
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;
