import { z } from 'zod';

const stringToArray = z.union([z.string(), z.array(z.string())]).transform(v =>
  Array.isArray(v) ? v : [v]
).optional();

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
  categorySlug: z.string().optional(),
  sizes: stringToArray,
  colors: stringToArray,
  types: stringToArray,
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

