import prisma from '@/lib/prisma';

/**
 * Returns tokens of the active theme on the server (RSC).
 * Falls back to empty object if not set.
 */
export async function getActiveThemeTokens(): Promise<Record<string, unknown>> {
  const settings = await prisma.settings.findFirst();
  const slug = settings?.activeThemeSlug ?? null;
  if (!slug) return {};
  const theme = await prisma.theme.findUnique({ where: { slug } });
  return (theme?.tokens ?? {}) as Record<string, unknown>;
}
