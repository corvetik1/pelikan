import { NextRequest } from 'next/server';
import { GET as getNews, POST as postNews } from '../route';
import { PATCH as patchNews, DELETE as deleteNews } from '../[id]/route';
import type { AdminNews } from '@/types/admin';

/**
 * In-memory list imitating prisma.news for unit tests.
 */
const news: AdminNews[] = [
  {
    id: 'n1',
    slug: 'pervaya-novost',
    title: 'Первая новость',
    excerpt: 'Анонс',
    content: '',
    date: new Date('2025-01-01').toISOString(),
  },
];

/**
 * Mock prisma client limited to methods used by route handlers.
 */
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    news: {
      findMany: jest.fn(async () => news),
      findUnique: jest.fn(async ({ where: { id } }: { where: { id: string } }) => news.find((n) => n.id === id) || null),
      create: jest.fn(async ({ data }: { data: Omit<AdminNews, 'id'> }) => {
        const created: AdminNews = { id: `n${Date.now()}`, ...data } as AdminNews;
        news.push(created);
        return created;
      }),
      update: jest.fn(async ({ where: { id }, data }: { where: { id: string }; data: Partial<AdminNews> }) => {
        const idx = news.findIndex((n) => n.id === id);
        if (idx === -1) throw new Error('Not found');
        news[idx] = { ...news[idx], ...data } as AdminNews;
        return news[idx];
      }),
      delete: jest.fn(async ({ where: { id } }: { where: { id: string } }) => {
        const idx = news.findIndex((n) => n.id === id);
        if (idx === -1) throw new Error('Not found');
        return news.splice(idx, 1)[0];
      }),
    },
  },
}));

/** Helper to build NextRequest */
const jsonRequest = (method: string, url: string, body?: unknown): NextRequest => {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return new NextRequest(new Request(url, init));
};

// ---------------- Tests ----------------

describe('/api/admin/news routes', () => {
  it('GET returns list', async () => {
    const res = await getNews(new Request('http://localhost/api/admin/news'));
    expect(res.status).toBe(200);
    expect((await res.json()) as AdminNews[]).toHaveLength(1);
  });

  it('POST creates news', async () => {
    const payload = { title: 'Новая', excerpt: 'Коротко', content: 'Текст' } satisfies Partial<AdminNews>;
    const req = jsonRequest('POST', 'http://localhost/api/admin/news', payload);
    const res = await postNews(req);
    expect(res.status).toBe(201);
    const created = (await res.json()) as AdminNews;
    expect(created.title).toBe('Новая');
    expect(news).toHaveLength(2);
  });

  it('PATCH updates item', async () => {
    const patch = { excerpt: 'Обновлено' };
    const req = jsonRequest('PATCH', 'http://localhost/api/admin/news/n1', patch);
    const res = await patchNews(req, { params: Promise.resolve({ id: 'n1' }) });
    expect(res.status).toBe(200);
    const updated = (await res.json()) as AdminNews;
    expect(updated.excerpt).toBe('Обновлено');
  });

  it('DELETE removes item', async () => {
    const req = jsonRequest('DELETE', 'http://localhost/api/admin/news/n1');
    const res = await deleteNews(req, { params: Promise.resolve({ id: 'n1' }) });
    expect(res.status).toBe(200);
    expect(news.find((n) => n.id === 'n1')).toBeUndefined();
  });
});
