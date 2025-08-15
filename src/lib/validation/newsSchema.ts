import { z } from 'zod';

/**
 * Zod schemas for News entity.
 */

export const NewsBaseSchema = z.object({
  title: z.string().trim().min(1).max(256),
  excerpt: z.string().trim().min(1).max(1024),
  content: z.string().trim().min(1).max(50000).refine((v) => !/<script[\s>]/i.test(v), { message: 'Inline <script> tags are not allowed' }),
  img: z.string().url().optional().or(z.literal('').optional()),
  // Optional relation to NewsCategory
  categoryId: z.string().uuid().nullable().optional(),
  // Optional date string (YYYY-MM-DD or ISO); if omitted, server sets now()
  date: z
    .string()
    .refine((val) => /^(\d{4}-\d{2}-\d{2})$/.test(val) || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
});

export const NewsCreateSchema = NewsBaseSchema;

export const NewsUpdateSchema = NewsBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' },
);

export type NewsCreateInput = z.infer<typeof NewsCreateSchema>;
export type NewsUpdateInput = z.infer<typeof NewsUpdateSchema>;
