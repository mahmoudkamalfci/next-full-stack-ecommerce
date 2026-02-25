import { Router } from 'express';
export const cartRouter: Router = Router();
cartRouter.get('/', (req, res) => { res.json({ msg: 'cart' }) });
