import { z } from 'zod';

export const ReviewCreateSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(3).max(1000),
  author: z.string().email().optional(),
});

export type ReviewCreateInput = z.infer<typeof ReviewCreateSchema>;

export const ReviewStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const ReviewUpdateStatusSchema = z.object({
  status: ReviewStatusSchema,
});
