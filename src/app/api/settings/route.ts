import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';
import { settingsPatchSchema } from '@/lib/validation/settingsSchema';
import { handleError } from '@/lib/errorHandler';

export const runtime = 'nodejs';

/**
 * GET /api/settings – возвращает одну строку настроек.
 * Если таблица пуста — создаёт запись со значениями по умолчанию.
 */
export const GET = withLogger(async () => {
  const settings = await prisma.settings.findFirst();
  if (settings) return NextResponse.json(settings);
  // создаём запись по умолчанию
  const created = await prisma.settings.create({
    data: {
      activeThemeSlug: 'default',
    },
  });
  return NextResponse.json(created);
});

/**
 * PATCH /api/settings — обновление настроек (только админ).
 */
export const PATCH = withLogger(async (req: Request) => {
  const auth = requireAdmin(req);
  if (auth) return auth;
  try {
    const payload = await req.json();
    const data = settingsPatchSchema.parse(payload);

    await prisma.settings.updateMany({
      data: { activeThemeSlug: data.activeThemeSlug },
    });
    // Prisma updateMany returns count; fetch row again
    const settings = await prisma.settings.findFirst();
    broadcastInvalidate([
      { type: 'Settings', id: 'LIST' },
      { type: 'Theme', id: 'LIST' },
    ], 'Активная тема изменена');
    return NextResponse.json(settings);
  } catch (err) {
    return handleError(err);
  }
});
