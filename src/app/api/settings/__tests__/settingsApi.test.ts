import { GET as getSettings, PATCH as patchSettings } from '../route';
import type { SocialLink, ContactItem } from '@/types/settings';

// In-memory singleton settings row used by prisma mock
interface SettingsRow {
  id: number;
  activeThemeSlug: string;
  logoUrl: string | null;
  heroSpeedMs: number;
  socials: SocialLink[];
  contacts: ContactItem[];
  priceListUrl: string | null;
  ctaTitle: string | null;
  ctaSubtitle: string | null;
  homeNewsTitle: string | null;
  homeRecipesTitle: string | null;
}

let settingsMemory: SettingsRow | null = null;

/**
 * Mock prisma client limited to methods used by route handlers.
 */
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    settings: {
      findFirst: jest.fn(async () => settingsMemory),
      create: jest.fn(async ({ data }: { data: Partial<SettingsRow> }) => {
        settingsMemory = {
          id: 1,
          activeThemeSlug: (data.activeThemeSlug as string) ?? 'default',
          logoUrl: (data.logoUrl as string | null) ?? null,
          heroSpeedMs: (data.heroSpeedMs as number) ?? 5000,
          socials: (data.socials as SocialLink[]) ?? [],
          contacts: (data.contacts as ContactItem[]) ?? [],
          priceListUrl: (data.priceListUrl as string | null) ?? null,
          ctaTitle: (data.ctaTitle as string | null) ?? null,
          ctaSubtitle: (data.ctaSubtitle as string | null) ?? null,
          homeNewsTitle: (data.homeNewsTitle as string | null) ?? null,
          homeRecipesTitle: (data.homeRecipesTitle as string | null) ?? null,
        };
        return settingsMemory;
      }),
      updateMany: jest.fn(async ({ data }: { data: Partial<SettingsRow> }) => {
        if (!settingsMemory) {
          settingsMemory = {
            id: 1,
            activeThemeSlug: 'default',
            logoUrl: null,
            heroSpeedMs: 5000,
            socials: [],
            contacts: [],
            priceListUrl: null,
            ctaTitle: null,
            ctaSubtitle: null,
            homeNewsTitle: null,
            homeRecipesTitle: null,
          };
        }
        settingsMemory = {
          ...settingsMemory,
          ...data,
        } as SettingsRow;
        return { count: 1 };
      }),
    },
  },
}));

/** Helper to build Request */
const jsonRequest = (method: string, url: string, body?: unknown): Request => {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return new Request(url, init);
};

// ---------------- Tests ----------------

describe('/api/settings route', () => {
  it('GET returns settings, creating defaults when empty', async () => {
    // Initially empty memory
    settingsMemory = null;
    const res = await getSettings(new Request('http://localhost/api/settings'));
    expect(res.status).toBe(200);
    const data = (await res.json()) as SettingsRow;
    expect(data.activeThemeSlug).toBe('default');
  });

  it('PATCH accepts and persists new homepage CMS fields', async () => {
    // Ensure a row exists
    await getSettings(new Request('http://localhost/api/settings'));

    const payload = {
      priceListUrl: 'https://example.com/prices.pdf',
      ctaTitle: 'CTA Title',
      ctaSubtitle: 'Subtitle',
      homeNewsTitle: 'Новости',
      homeRecipesTitle: 'Рецепты',
    } satisfies Partial<SettingsRow>;

    const req = jsonRequest('PATCH', 'http://localhost/api/settings', payload);
    const res = await patchSettings(req);
    expect(res.status).toBe(200);
    const updated = (await res.json()) as SettingsRow;
    expect(updated.priceListUrl).toBe('https://example.com/prices.pdf');
    expect(updated.ctaTitle).toBe('CTA Title');
    expect(updated.ctaSubtitle).toBe('Subtitle');
    expect(updated.homeNewsTitle).toBe('Новости');
    expect(updated.homeRecipesTitle).toBe('Рецепты');
  });

  it('PATCH rejects invalid URL', async () => {
    const req = jsonRequest('PATCH', 'http://localhost/api/settings', { priceListUrl: 'not-a-url' });
    const res = await patchSettings(req);
    expect(res.status).toBe(400);
  });
});
