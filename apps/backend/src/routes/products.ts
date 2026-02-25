import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const productRouter: Router = Router();

productRouter.get('/', (req, res) => { res.json({ msg: 'products' }) });

productRouter.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        categories: { include: { category: true } },
        options: {
          include: { values: true }
        },
        variants: {
          include: {
            optionValues: {
               include: { optionValue: true }
            }
          }
        }
      }
    });

    if (!product) {
       res.status(404).json({ error: 'Product not found' });
       return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});
