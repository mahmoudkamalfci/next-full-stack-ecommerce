import { prisma } from '../lib/prisma.js';

export const findProducts = async (filters: { q?: string; categorySlug?: string; page: number; limit: number }) => {
  const skip = (filters.page - 1) * filters.limit;
  const where: any = { isActive: true };
  
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } }
    ];
  }
  if (filters.categorySlug) {
    where.categories = { some: { category: { slug: filters.categorySlug } } };
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({ 
      where,
      skip,
      take: filters.limit,
      include: {
        options: { include: { values: true } },
        variants: { include: { optionValues: { include: { optionValue: true } } } } 
      }
    }),
    prisma.product.count({ where })
  ]);

  return { data, total };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: { include: { category: true } },
      options: { include: { values: true } },
      variants: { include: { optionValues: { include: { optionValue: true } } } }
    }
  });
  return product;
};
