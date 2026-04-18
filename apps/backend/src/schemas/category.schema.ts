import { z } from 'zod';

export const getCategoriesQuerySchema = z.object({
    isFeatured: z.coerce.boolean().optional(),
    limit: z.coerce.number().optional(),
});