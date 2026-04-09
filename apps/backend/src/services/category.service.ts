import { prisma } from '../lib/prisma.js';

export const getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    include: {
      children: true
    }
  });
};
