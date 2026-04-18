import { prisma } from '../lib/prisma.js';

export const getCategories = async (query: { isFeatured?: boolean, limit?: number }) => {
  return prisma.category.findMany({
    where: { isActive: true, isFeatured: query.isFeatured },
    include: {
      children: true
    },
    take: query.limit || undefined
  });
};

export const getTopCategoriesByProductCount = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: {
      products: {
        _count: 'desc'
      }
    },
    take: 4,
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
};
