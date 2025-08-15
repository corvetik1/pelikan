import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import { themeUpdateSchema } from '@/lib/validation/themeSchema';
import { slugify } from '@/lib/slugify';
import { handleError } from '@/lib/errorHandler';
import type { Theme } from '@prisma/client';

// PATCH /api/admin/themes/[slug] – обновить тему
export const PATCH = withLogger(
  withInvalidate([{ type: 'Theme', id: 'LIST' }], 'Тема обновлена')(
    async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
      const auth = requireAdmin(req);
      if (auth) return auth;
      try {
        const { slug } = await params;
        const payload = await req.json();
        const data = themeUpdateSchema.parse(payload);

        // Если изменили name и не передали slug – генерируем автоматически
        if (data.name && !data.slug) {
          (data as Record<string, unknown>).slug = slugify(data.name);
        }

        const updated: Theme = await prisma.theme.update({ where: { slug }, data });
        return Response.json(updated);
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);

// DELETE /api/admin/themes/[slug] – удалить тему
export const DELETE = withLogger(
  withInvalidate([{ type: 'Theme', id: 'LIST' }], 'Тема удалена')(
    async (_req: Request, { params }: { params: Promise<{ slug: string }> }) => {
      const auth = requireAdmin(_req);
      if (auth) return auth;
      try {
        const { slug } = await params;

        // Запрет удаления базовой (предустановленной) темы
        if (slug === 'default') {
          return new Response(
            JSON.stringify({ error: 'Нельзя удалить базовую тему' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }

        // Запрет удаления активной темы
        const settings = await prisma.settings.findUnique({ where: { id: 1 } });
        if (settings?.activeThemeSlug === slug) {
          return new Response(
            JSON.stringify({ error: 'Нельзя удалить активную тему' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }

        await prisma.theme.delete({ where: { slug } });
        return Response.json({ ok: true });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
