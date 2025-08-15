import type { BrowserContext } from '@playwright/test';

export interface TestMedia {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt?: string;
  tags: string[];
  createdAt: string;
}

export interface MediaListResponse {
  items: TestMedia[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminSettingsMediaMocksOptions {
  initialMedia?: ReadonlyArray<TestMedia>;
  pageSize?: number;
  settings?: Partial<{
    activeThemeSlug: string;
    logoUrl: string | null;
    heroSpeedMs: number;
    socials: Array<unknown>;
    contacts: Array<unknown>;
  }>;
}

export interface AdminSettingsMediaMocksController {
  getAllMedia: () => ReadonlyArray<TestMedia>;
  addMedia: (m: TestMedia) => void;
  removeMediaById: (id: string) => void;
  getSavedSettingsPayload: () => unknown;
}

export async function setupAdminSettingsAndMediaMocks(
  context: BrowserContext,
  opts: AdminSettingsMediaMocksOptions = {},
): Promise<AdminSettingsMediaMocksController> {
  const pageSize = Math.max(1, opts.pageSize ?? 8);
  let allItems: TestMedia[] = [...(opts.initialMedia ?? [])];
  let savedPayload: unknown = null;

  const baseSettings = {
    activeThemeSlug: 'default',
    logoUrl: null as string | null,
    heroSpeedMs: 5000,
    socials: [] as Array<unknown>,
    contacts: [] as Array<unknown>,
    ...opts.settings,
  };

  await context.route('**/api/settings', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    if (method === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(baseSettings) });
    }
    if (method === 'PATCH') {
      try {
        savedPayload = JSON.parse(req.postData() || '{}');
      } catch {
        savedPayload = {};
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    }
    return route.fallback();
  });

  await context.route('**/api/admin/themes', (route) => {
    const themes = [{ slug: 'default', name: 'Default', tokens: {}, preview: null, id: 'default', createdAt: new Date().toISOString() }];
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(themes) });
  });

  await context.route('**/api/admin/upload**', async (route) => {
    const req = route.request();
    const method = req.method().toUpperCase();
    const url = new URL(req.url());

    if (method === 'POST') {
      // For tests we assume server returns an array of created media
      const created = createMediaStub(allItems.length + 1);
      allItems = [created, ...allItems];
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify([created]) });
    }

    if (method === 'GET') {
      const pageNum = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
      const start = (pageNum - 1) * pageSize;
      const paged = allItems.slice(start, start + pageSize);
      const payload: MediaListResponse = { items: paged, total: allItems.length, page: pageNum, pageSize };
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
    }

    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await context.route('**/api/admin/upload/*', (route) => {
    if (route.request().method().toUpperCase() !== 'DELETE') return route.fallback();
    const url = new URL(route.request().url());
    const id = url.pathname.split('/').pop() ?? '';
    allItems = allItems.filter((m) => m.id !== id);
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  return {
    getAllMedia: () => allItems,
    addMedia: (m: TestMedia) => { allItems = [m, ...allItems]; },
    removeMediaById: (id: string) => { allItems = allItems.filter((i) => i.id !== id); },
    getSavedSettingsPayload: () => savedPayload,
  } as const;
}

export function createMediaStub(n: number): TestMedia {
  return {
    id: `m${n}`,
    filename: `file_${n}.jpg`,
    url: `/uploads/file_${n}.jpg`,
    mimeType: 'image/jpeg',
    size: 1024 + n,
    tags: [],
    createdAt: new Date(Date.now() - n * 1000).toISOString(),
  };
}
