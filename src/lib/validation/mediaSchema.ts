import { z } from 'zod';

// Доп. метаданные для загрузки медиа через multipart/form-data
// Эти поля опциональны и валидируются на сервере, но пока не сохраняются в БД
export const mediaMetaSchema = z.object({
  alt: z
    .string()
    .trim()
    .max(200, 'alt слишком длинный')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  tags: z
    .array(z.string().trim().min(1))
    .max(20, 'слишком много тегов')
    .optional(),
});

export type MediaMetaInput = z.infer<typeof mediaMetaSchema>;
