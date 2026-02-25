import { Router } from 'express';
export const checkoutRouter: Router = Router();
checkoutRouter.get('/', (req, res) => { res.json({ msg: 'checkout' }) });
