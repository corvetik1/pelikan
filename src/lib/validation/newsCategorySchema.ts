import { z } from 'zod';
import { slugify } from '@/lib/slugify';

export const newsCategoryCreateSchema = z.object({
  title: z.string().min(1, 'Название обязательно').transform((t) => t.trim()),
});

export const newsCategoryUpdateSchema = z.object({
  title: z.string().min(1).optional().transform((t) => (typeof t === 'string' ? t.trim() : t)),
});

export type NewsCategoryCreateInput = z.infer<typeof newsCategoryCreateSchema>;
export type NewsCategoryUpdateInput = z.infer<typeof newsCategoryUpdateSchema>;

// Helper to produce slug (kept here for schema consumers if needed)
export const createSlug = (title: string) => slugify(title);
