import { z } from 'zod';

/**
 * PATCH /api/settings body validation
 */
export const settingsPatchSchema = z.object({
  activeThemeSlug: z.string().trim().min(1, 'Slug is required'),
});

export type SettingsPatch = z.infer<typeof settingsPatchSchema>;
