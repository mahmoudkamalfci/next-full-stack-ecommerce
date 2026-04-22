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

export const getCategoryFilters = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: { select: { id: true } } },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const categoryIds = [category.id, ...category.children.map((c: { id: number }) => c.id)];

  const [sizeValues, colorValues, productTypes] = await Promise.all([
    prisma.productOptionValue.findMany({
      where: {
        option: {
          name: { equals: 'Size', mode: 'insensitive' },
          product: {
            isActive: true,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
        },
      },
      distinct: ['value'],
      select: { value: true },
    }),
    prisma.productOptionValue.findMany({
      where: {
        option: {
          name: { equals: 'Color', mode: 'insensitive' },
          product: {
            isActive: true,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
        },
      },
      distinct: ['value'],
      select: { value: true },
    }),
    prisma.productType.findMany({
      where: {
        products: {
          some: {
            isActive: true,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
        },
      },
      select: { name: true },
    }),
  ]);

  return {
    sizes: sizeValues.map((v: { value: string }) => v.value),
    colors: colorValues.map((v: { value: string }) => v.value),
    productTypes: productTypes.map((pt: { name: string }) => pt.name),
  };
};
