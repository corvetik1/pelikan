import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { withLogger } from '@/lib/logger';
import { broadcastInvalidate } from '@/server/socket';
import { settingsPatchSchema } from '@/lib/validation/settingsSchema';
import { handleError } from '@/lib/errorHandler';
import type { Prisma } from '@prisma/client';

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
    const patch = settingsPatchSchema.parse(payload);

    const data: {
      activeThemeSlug?: string;
      logoUrl?: string | null;
      heroSpeedMs?: number;
      socials?: Prisma.InputJsonValue;
      contacts?: Prisma.InputJsonValue;
      priceListUrl?: string | null;
      ctaTitle?: string | null;
      ctaSubtitle?: string | null;
      homeNewsTitle?: string | null;
      homeRecipesTitle?: string | null;
    } = {};

    if (patch.activeThemeSlug !== undefined) data.activeThemeSlug = patch.activeThemeSlug;
    if (patch.logoUrl !== undefined) data.logoUrl = patch.logoUrl;
    if (patch.heroSpeedMs !== undefined) data.heroSpeedMs = patch.heroSpeedMs;
    if (patch.socials !== undefined) data.socials = patch.socials;
    if (patch.contacts !== undefined) data.contacts = patch.contacts;
    if (patch.priceListUrl !== undefined) data.priceListUrl = patch.priceListUrl;
    if (patch.ctaTitle !== undefined) data.ctaTitle = patch.ctaTitle;
    if (patch.ctaSubtitle !== undefined) data.ctaSubtitle = patch.ctaSubtitle;
    if (patch.homeNewsTitle !== undefined) data.homeNewsTitle = patch.homeNewsTitle;
    if (patch.homeRecipesTitle !== undefined) data.homeRecipesTitle = patch.homeRecipesTitle;

    if (Object.keys(data).length > 0) {
      await prisma.settings.updateMany({ data });
    }
    // Prisma updateMany returns count; fetch row again
    const settings = await prisma.settings.findFirst();
    broadcastInvalidate([
      { type: 'Settings', id: 'LIST' },
      { type: 'Theme', id: 'LIST' },
    ], 'Настройки обновлены');
    return NextResponse.json(settings);
  } catch (err) {
    return handleError(err);
  }
});
