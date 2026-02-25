import { Router } from 'express';
export const categoryRouter: Router = Router();
categoryRouter.get('/', (req, res) => { res.json({ msg: 'categories' }) });
