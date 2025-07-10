import { z } from 'zod';

/**
 * Zod schemas for Recipe creation and update.
 * Only fields coming from the client are validated.
 */

export const RecipeBaseSchema = z.object({
  title: z.string().trim().min(1).max(256),
  slug: z.string().trim().min(1).max(256).optional(),
  img: z.string().url().optional().or(z.literal('').optional()),
  shortDescription: z.string().trim().min(1).max(512),
  ingredients: z.array(z.string().trim().min(1)).nonempty(),
  steps: z.array(z.string().trim().min(1)).nonempty(),
  cookingTime: z.number().int().positive(),
  category: z.string().trim().min(1).max(64),
  images: z.array(z.string().url()).optional(),
  productIds: z.array(z.string().uuid()).optional(),
});

export const RecipeCreateSchema = RecipeBaseSchema;

export const RecipeUpdateSchema = RecipeBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided for update',
  },
);

export type RecipeCreateInput = z.infer<typeof RecipeCreateSchema>;
export type RecipeUpdateInput = z.infer<typeof RecipeUpdateSchema>;
