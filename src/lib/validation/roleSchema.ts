import { z } from 'zod';

export const roleCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional().default([]),
});

export const roleUpdateSchema = roleCreateSchema.partial();

export type RoleCreateInput = z.infer<typeof roleCreateSchema>;
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
