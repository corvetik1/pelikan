import { z } from 'zod';

/**
 * Zod schemas for News entity.
 */

export const NewsBaseSchema = z.object({
  title: z.string().trim().min(1).max(256),
  excerpt: z.string().trim().min(1).max(1024),
  category: z.string().trim().min(1).max(64),
  // Optional ISO date string; if omitted, server sets now()
  date: z.string().datetime().optional(),
});

export const NewsCreateSchema = NewsBaseSchema;

export const NewsUpdateSchema = NewsBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' },
);

export type NewsCreateInput = z.infer<typeof NewsCreateSchema>;
export type NewsUpdateInput = z.infer<typeof NewsUpdateSchema>;
