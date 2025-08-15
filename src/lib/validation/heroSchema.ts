import { z } from 'zod';

export const heroSlideSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500),
  img: z.string().min(1),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const heroSlideListSchema = z.array(heroSlideSchema);

export type HeroSlideOutput = z.infer<typeof heroSlideSchema>;
export type HeroSlideListOutput = z.infer<typeof heroSlideListSchema>;

// Create schema for admin hero slide
export const heroCreateSchema = z.object({
  title: z.string().min(1).max(200),
  // subtitle может быть пустым, но не undefined — приведём к пустой строке по умолчанию на уровне обработчика
  subtitle: z.string().max(500).optional(),
  img: z.string().url(),
});

export const heroPatchSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    subtitle: z.string().max(500).optional(),
    img: z.string().url().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Patch object must not be empty' });

export type HeroCreateInput = z.infer<typeof heroCreateSchema>;
export type HeroPatchInput = z.infer<typeof heroPatchSchema>;
