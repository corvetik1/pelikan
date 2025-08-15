import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { withInvalidate } from '@/lib/withInvalidate';
import { mediaMetaSchema } from '@/lib/validation/mediaSchema';

export const runtime = 'nodejs';

// Папка для загрузок внутри public, чтобы Next.js мог отдавать файлы статикой
const uploadDir = path.join(process.cwd(), 'public', process.env.UPLOAD_DIR ?? 'uploads');

async function ensureDir(): Promise<void> {
  await fs.mkdir(uploadDir, { recursive: true });
}

// Разрешённые MIME-типы
const ALLOWED_MIME = new Set<string>([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

/**
 * GET /api/admin/upload
 * Пагинированный список медиа-файлов (page=1 по умолчанию, pageSize=20)
 */
export const GET = withLogger(async (request: Request) => {
  const auth = requireAdmin(request);
  if (auth) return auth;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  }),
    prisma.media.count(),
  ]);
  return NextResponse.json({ items, total, page, pageSize });
});

/**
 * POST /api/admin/upload
 * Принимает multipart/form-data, поле name = "file" (single / multiple)
 * Сохраняет файлы на диск (public/uploads) и создаёт записи Media.
 */
export const POST = withLogger(
  withInvalidate([{ type: 'Media', id: 'LIST' }], 'Файл(ы) загружены')(
    async (request: Request) => {
      const auth = requireAdmin(request);
      if (auth) return auth;
      await ensureDir();
      const formData = await request.formData();
      const files = formData.getAll('file');
      if (!files.length) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Извлекаем и валидируем метаданные (alt, tags)
      const altRaw = formData.get('alt');
      const tagsRaw = formData.getAll('tags');
      const tagsList = tagsRaw
        .flatMap((v) => (typeof v === 'string' ? v.split(',') : []))
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      mediaMetaSchema.parse({
        alt: typeof altRaw === 'string' ? altRaw : undefined,
        tags: tagsList.length ? tagsList : undefined,
      });

      const createdRecords: Awaited<ReturnType<typeof prisma.media.create>>[] = [];
      // Ограничение размера (env UPLOAD_MAX_SIZE_MB, по умолчанию 5 МБ)
      const maxSize = (Number(process.env.UPLOAD_MAX_SIZE_MB) || 5) * 1024 * 1024;

      for (const entry of files) {
        if (!(entry instanceof File)) continue;
        if (entry.size > maxSize) {
          return NextResponse.json({ error: 'File too large' }, { status: 413 });
        }
        if (!ALLOWED_MIME.has(entry.type)) {
          return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
        }
        const arrayBuffer = await entry.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = path.extname(entry.name) || '';
        const filename = `${randomUUID()}${ext}`;
        const destPath = path.join(uploadDir, filename);
        await fs.writeFile(destPath, buffer);

        const record = await prisma.media.create({
          data: {
            filename: entry.name,
            url: `/uploads/${filename}`,
            mimeType: entry.type,
            size: entry.size,
            // meta.alt / meta.tags пока не сохраняем — зарезервировано под расширение схемы
          },
        });
        createdRecords.push(record);
      }

      return NextResponse.json(createdRecords, { status: 201 });
    },
  ),
);
