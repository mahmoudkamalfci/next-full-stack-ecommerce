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

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    if (!where.AND) where.AND = [];
    
    if (filters.minPrice !== undefined) {
      where.AND.push({
        variants: {
          every: {
            price: {
              gte: filters.minPrice
            }
          }
        }
      });
      where.AND.push({
        variants: {
          some: {}
        }
      });
    }

    if (filters.maxPrice !== undefined) {
      where.AND.push({
        variants: {
          some: {
            price: {
              lte: filters.maxPrice
            }
          }
        }
      });
    }
  }

  console.log(where, 'where')


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
      categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
      options: { select: { name: true, values: { select: { id: true, value: true } } } },
      variants: {
        select: {
           id: true, 
           sku: true, 
           price: true, 
           inventoryQuantity: true, 
           optionValues: { 
            select: {
               optionValue: {  
                select: { id: true, value: true } 
              } 
            }
          }
        }
      },
      images: {select: {imageUrl: true}},
      productType: {select: {name: true}},
    }
  });
  return product;
};
