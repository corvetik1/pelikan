import { z } from 'zod';
import { slugify } from '@/lib/slugify';

export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const jsonValue: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValue), z.record(jsonValue)]),
);

// Ограничения на размер и глубину токенов
export const MAX_TOKENS_BYTES = 32 * 1024; // 32 KB
export const MAX_TOKENS_DEPTH = 6;

/**
 * Рекурсивно вычисляет максимальную глубину вложенности объекта/массива.
 */
export function calculateDepth(value: JsonValue, currentDepth = 0): number {
  // Base case: primitive value or null – depth stays the same
  if (value === null || typeof value !== 'object') {
    return currentDepth;
  }

  let maxDepth = currentDepth + 1;

  if (Array.isArray(value)) {
    for (const item of value) {
      maxDepth = Math.max(maxDepth, calculateDepth(item, currentDepth + 1));
    }
  } else {
    for (const val of Object.values(value)) {
      maxDepth = Math.max(maxDepth, calculateDepth(val, currentDepth + 1));
    }
  }

  return maxDepth;
}

export const themeTokensSchema = z
  .record(jsonValue)
  .superRefine((obj, ctx) => {
    // 1. Обязательные ключи
    if (!('palette' in obj)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Отсутствует ключ palette' });
    }
    if (!('typography' in obj)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Отсутствует ключ typography' });
    }

    // 2. Проверка глубины
    const depth = calculateDepth(obj);
    if (depth > MAX_TOKENS_DEPTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Слишком большая вложенность объектов (${depth} > ${MAX_TOKENS_DEPTH})`,
      });
    }

    // 3. Ограничение размера (≈байты UTF-8)
    const size = new TextEncoder().encode(JSON.stringify(obj)).length;
    if (size > MAX_TOKENS_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Размер токенов превышает ${MAX_TOKENS_BYTES / 1024}KB (${size}B)`,
      });
    }
  });

export const themeCreateSchema = z.object({
  name: z.string().min(1, 'Название обязательно').transform((v) => v.trim()),
  slug: z.string().optional().transform((v) => (v ? slugify(v) : undefined)),
  tokens: themeTokensSchema,
  preview: z.string().url().optional(),
});

export const themeUpdateSchema = z.object({
  slug: z.string().optional().transform((v) => (v ? slugify(v) : v)),
  name: z.string().min(1).optional().transform((v) => (typeof v === 'string' ? v.trim() : v)),
  tokens: themeTokensSchema.optional(),
  preview: z.string().url().nullable().optional(),
});

export type ThemeCreateInput = z.infer<typeof themeCreateSchema>;
export type ThemeUpdateInput = z.infer<typeof themeUpdateSchema>;
