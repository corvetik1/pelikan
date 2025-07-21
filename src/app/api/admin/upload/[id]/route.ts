import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logger';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { getIO } from '@/server/socket';

export const runtime = 'nodejs';

export const DELETE = withLogger(async (_req: Request, { params }: { params: { id: string } }) => {
  const auth = requireAdmin(_req);
  if (auth) return auth;
  const { id } = params;
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    // Извлекаем физический путь из URL
    const uploadPath = path.join(process.cwd(), 'public', media.url.startsWith('/') ? media.url.slice(1) : media.url);
    // Удаляем файл, если существует
    try {
      await fs.unlink(uploadPath);
    } catch {
      // файл мог быть удалён вручную – игнорируем
    }
    const removed = await prisma.media.delete({ where: { id } });
    // Broadcast invalidate event
    getIO()?.emit('invalidate', {
      tags: [{ type: 'Media', id: 'LIST' }],
      message: 'Файл удалён'
    });
    return NextResponse.json(removed);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
});
