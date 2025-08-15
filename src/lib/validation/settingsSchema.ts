import { z } from 'zod';

/**
 * Общие типы для настроек
 */
export const socialLinkSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  url: z.string().url(),
  icon: z.string().optional(),
});

export const contactTypeSchema = z.enum(['phone', 'email', 'address', 'link']);

export const contactItemSchema = z.object({
  id: z.string().min(1),
  type: contactTypeSchema,
  label: z.string().min(1).max(50).optional(),
  value: z.string().min(1).max(200),
});

/**
 * PATCH /api/settings — частичное обновление
 */
export const settingsPatchSchema = z.object({
  activeThemeSlug: z.string().trim().min(1, 'Slug is required').optional(),
  logoUrl: z.string().url().nullable().optional(),
  heroSpeedMs: z.number().int().min(1000).max(60000).optional(),
  socials: z.array(socialLinkSchema).max(20).optional(),
  contacts: z.array(contactItemSchema).max(50).optional(),
  // Homepage CMS + CTA
  priceListUrl: z.string().url().nullable().optional(),
  ctaTitle: z.string().trim().max(120).nullable().optional(),
  ctaSubtitle: z.string().trim().max(240).nullable().optional(),
  homeNewsTitle: z.string().trim().max(120).nullable().optional(),
  homeRecipesTitle: z.string().trim().max(120).nullable().optional(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type ContactItemInput = z.infer<typeof contactItemSchema>;
export type SettingsPatch = z.infer<typeof settingsPatchSchema>;
