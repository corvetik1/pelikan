import { z } from 'zod';

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(64).optional(),
  role: z.enum(['admin', 'viewer', 'editor']).optional(),
  isActive: z.boolean().optional(),
});

export const userUpdateSchema = userCreateSchema.partial();

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
