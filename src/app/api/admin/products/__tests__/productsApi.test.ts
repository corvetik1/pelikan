import { NextRequest } from 'next/server';
import { GET as getProducts, POST as postProduct } from '../route';
import { PATCH as patchProduct, DELETE as deleteProduct } from '../[id]/route';
import type { AdminProduct } from '@/types/admin';

/**
 * In-memory store to mock prisma.product behaviour
 */
const products: AdminProduct[] = [
  {
    id: 'p1',
    name: 'Товар 1',
    slug: 'tovar-1',
    price: 1000,
    weight: '500 г',
    category: 'sausages',
    img: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Товар 2',
    slug: 'tovar-2',
    price: 1500,
    weight: '600 г',
    category: 'sausages',
    img: '',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Mock prisma client used in the route handlers.
 * Only methods that our tests touch are mocked.
 */
jest.mock('@/lib/prisma', () => {
  return {
    __esModule: true,
    default: {
      product: {
        findMany: jest.fn(async () => products),
        create: jest.fn(async ({ data }: { data: Omit<AdminProduct, 'id' | 'createdAt'> }) => {
          const prod: AdminProduct = {
            id: `p${Date.now()}`,
            createdAt: new Date().toISOString(),
            ...data,
          } as AdminProduct;
          products.push(prod);
          return prod;
        }),
        update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<AdminProduct> }) => {
          const idx = products.findIndex((p) => p.id === where.id);
          if (idx === -1) throw new Error('Not found');
          products[idx] = { ...products[idx], ...data } as AdminProduct;
          return products[idx];
        }),
        delete: jest.fn(async ({ where }: { where: { id: string } }) => {
          const idx = products.findIndex((p) => p.id === where.id);
          if (idx === -1) throw new Error('Not found');
          const removed = products.splice(idx, 1)[0];
          return removed;
        }),
      },
    },
  };
});

/** Helper to build NextRequest with JSON body */
const jsonRequest = (method: string, url: string, body?: unknown): NextRequest => {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return new NextRequest(new Request(url, init));
};

// ---------------- Tests ----------------

describe('/api/admin/products route', () => {
  it('GET returns products list', async () => {
    const res = await getProducts();
    expect(res.status).toBe(200);
    const list = (await res.json()) as AdminProduct[];
    expect(list).toHaveLength(2);
  });

  it('POST creates product and auto-slugifies', async () => {
    const payload = {
      name: 'Новый товар',
      price: 2000,
      weight: '400 г',
      category: 'sausages',
    } satisfies Partial<AdminProduct>;

    const req = jsonRequest('POST', 'http://localhost/api/admin/products', payload);
    const res = await postProduct(req);
    expect(res.status).toBe(201);
    const prod = (await res.json()) as AdminProduct;
    expect(prod.name).toBe('Новый товар');
    expect(prod.slug).toBe('новый-товар'.replace(/\s+/g, '-'));
    expect(products).toHaveLength(3);
  });

  it('PATCH updates product fields', async () => {
    const patch = { price: 2500 };
    const req = jsonRequest('PATCH', 'http://localhost/api/admin/products/p1', patch);
    const res = await patchProduct(req, { params: { id: 'p1' } });
    expect(res.status).toBe(200);
    const json = (await res.json()) as AdminProduct;
    expect(json.price).toBe(2500);
  });

  it('DELETE removes product', async () => {
    const req = jsonRequest('DELETE', 'http://localhost/api/admin/products/p2');
    const res = await deleteProduct(req, { params: { id: 'p2' } });
    expect(res.status).toBe(200);
    const removed = (await res.json()) as AdminProduct;
    expect(removed.id).toBe('p2');
    expect(products.find((p) => p.id === 'p2')).toBeUndefined();
  });
});
