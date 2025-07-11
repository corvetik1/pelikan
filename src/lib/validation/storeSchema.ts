import { z } from 'zod';

/**
 * Zod schemas for Store entity.
 */

export const StoreBaseSchema = z.object({
  name: z.string().trim().min(1).max(256),
  address: z.string().trim().min(1).max(512),
  region: z.string().trim().min(1).max(128),
  lat: z.number().finite().optional(),
  lng: z.number().finite().optional(),
  isActive: z.boolean().optional(),
});

export const StoreCreateSchema = StoreBaseSchema.extend({
  lat: z.number().finite(),
  lng: z.number().finite(),
});

export const StoreUpdateSchema = StoreBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' },
);

export type StoreCreateInput = z.infer<typeof StoreCreateSchema>;
export type StoreUpdateInput = z.infer<typeof StoreUpdateSchema>;
