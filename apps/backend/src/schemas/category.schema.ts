import { z } from 'zod';

export const getCategoriesQuerySchema = z.object({
    isFeatured: z.coerce.boolean().optional(),
    limit: z.coerce.number().optional(),
});

export const categorySlugParamSchema = z.object({
  slug: z.string().min(1),
});