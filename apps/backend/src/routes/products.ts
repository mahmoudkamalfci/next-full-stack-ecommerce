import { Router } from 'express';
export const productRouter: Router = Router();
productRouter.get('/', (req, res) => { res.json({ msg: 'products' }) });
