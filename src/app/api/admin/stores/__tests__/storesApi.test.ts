import { NextRequest } from 'next/server';
import { GET as getStores, POST as postStore } from '../route';
import { PATCH as patchStore, DELETE as deleteStore } from '../[id]/route';
import type { AdminStore } from '@/types/admin';

const stores: AdminStore[] = [
  {
    id: 's1',
    name: 'Магазин 1',
    address: 'Тверская 1',
    region: 'Moscow',
    lat: 55.75,
    lng: 37.61,
    isActive: true,
  },
];

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    store: {
      findMany: jest.fn(async () => stores),
      update: jest.fn(async ({ where: { id }, data }: { where: { id: string }; data: Partial<AdminStore> }) => {
        const idx = stores.findIndex((s) => s.id === id);
        if (idx === -1) throw new Error('Not found');
        stores[idx] = { ...stores[idx], ...data } as AdminStore;
        return stores[idx];
      }),
      create: jest.fn(async ({ data }: { data: Omit<AdminStore, 'id'> }) => {
        const created: AdminStore = { id: `s${Date.now()}`, ...data } as AdminStore;
        stores.push(created);
        return created;
      }),
      delete: jest.fn(async ({ where: { id } }: { where: { id: string } }) => {
        const idx = stores.findIndex((s) => s.id === id);
        if (idx === -1) throw new Error('Not found');
        return stores.splice(idx, 1)[0];
      }),
    },
  },
}));

const jsonRequest = (method: string, url: string, body?: unknown): NextRequest => {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return new NextRequest(new Request(url, init));
};

describe('/api/admin/stores routes', () => {
  it('GET returns list', async () => {
    const res = await getStores(new Request('http://localhost/api/admin/stores'));
    expect(res.status).toBe(200);
    expect((await res.json()) as AdminStore[]).toHaveLength(1);
  });

  it('POST creates store', async () => {
    const payload = { name: 'Новый', address: 'Адрес', region: 'SPB', lat: 59.93, lng: 30.31 } satisfies Partial<AdminStore>;
    const req = jsonRequest('POST', 'http://localhost/api/admin/stores', payload);
    const res = await postStore(req);
    expect(res.status).toBe(201);
    expect(stores).toHaveLength(2);
  });

  it('PATCH updates store', async () => {
    const patch = { region: 'Tula' };
    const req = jsonRequest('PATCH', 'http://localhost/api/admin/stores/s1', patch);
    const res = await patchStore(req, { params: { id: 's1' } });
    expect(res.status).toBe(200);
    const json = (await res.json()) as AdminStore;
    expect(json.region).toBe('Tula');
  });

  it('DELETE removes store', async () => {
    const req = jsonRequest('DELETE', 'http://localhost/api/admin/stores/s1');
    const res = await deleteStore(req, { params: { id: 's1' } });
    expect(res.status).toBe(200);
    expect(stores.find((s) => s.id === 's1')).toBeUndefined();
  });
});
