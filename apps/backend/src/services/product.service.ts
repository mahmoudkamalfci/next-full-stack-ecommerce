import { prisma } from '../lib/prisma.js';

interface ProductQueryFilters {
  q?: string;
  categorySlug?: string;
  page: number;
  limit: number;
  colors?: string[];
  sizes?: string[];
  types?: string[];
  maxPrice?: number;
  minPrice?: number;
}

export const findProducts = async (filters: ProductQueryFilters) => {
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

  if (filters.colors?.length) {
    where.options = {
      some: {
        name: { equals: 'Color', mode: 'insensitive' },
        values: {
          some: {
            value: { in: filters.colors }
          }
        }
      }
    };
  }

  if (filters.sizes?.length) {
    where.options = {
      some: {
        name: { equals: 'Size', mode: 'insensitive' },
        values: {
          some: {
            value: { in: filters.sizes }
          }
        }
      }
    };
  }

  if (filters.types?.length) {
    where.productType = { name: { in: filters.types } };
  }

  if (filters.maxPrice || filters.minPrice) {
    console.log(filters, 'filters')
    where.variants = {
      some: {
        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice
        }
      }
    }
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({ 
      where,
      skip,
      take: filters.limit,
      include: {
        options: { include: { values: true } },
        variants: { include: { optionValues: { include: { optionValue: true } } } },
        images: true,
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
