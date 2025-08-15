import { z } from 'zod';

export const iconEnum = z.enum(['EmojiEvents', 'People', 'Verified', 'Factory']);

export const advantageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(500),
  icon: iconEnum,
  order: z.number().int().min(0),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const advantageListSchema = z.array(advantageSchema);

export const advantagePatchSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    subtitle: z.string().min(1).max(500).optional(),
    icon: iconEnum.optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Patch object must not be empty',
  });

export type AdvantageOutput = z.infer<typeof advantageSchema>;
export type AdvantageListOutput = z.infer<typeof advantageListSchema>;
export type AdvantagePatchInput = z.infer<typeof advantagePatchSchema>;
