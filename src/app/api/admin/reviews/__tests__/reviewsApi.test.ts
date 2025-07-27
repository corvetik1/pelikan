import { NextRequest } from 'next/server';
import { GET as getReviews } from '../route';
import { PATCH as patchReview } from '../[id]/route';
import type { Review } from '@/types/review';

/**
 * In-memory store to mock prisma.review behaviour.
 */
const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'Товар 1',
    rating: 5,
    body: 'Отлично!',
    status: 'pending',
    author: 'Ivan',
    createdAt: new Date().toISOString(),
  } as Review,
  {
    id: 'r2',
    productId: 'p2',
    productName: 'Товар 2',
    rating: 4,
    body: 'Неплохо',
    status: 'approved',
    author: 'Petr',
    createdAt: new Date().toISOString(),
  } as Review,
];

// Mock prisma client
jest.mock('@/lib/prisma', () => {
  return {
    __esModule: true,
    default: {
      review: {
        findMany: jest.fn(async ({ where, skip, take }: { where?: Record<string, unknown>; skip?: number; take?: number }) => {
          let filtered = reviews;
          if (where?.status) filtered = filtered.filter((r) => r.status === where.status);
          if (where?.productId) filtered = filtered.filter((r) => r.productId === where.productId);
          return filtered.slice(skip ?? 0, (skip ?? 0) + (take ?? filtered.length));
        }),
        count: jest.fn(async ({ where }: { where?: Record<string, unknown> }) => {
          let filtered = reviews;
          if (where?.status) filtered = filtered.filter((r) => r.status === where.status);
          if (where?.productId) filtered = filtered.filter((r) => r.productId === where.productId);
          return filtered.length;
        }),
        update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Review> }) => {
          const idx = reviews.findIndex((r) => r.id === where.id);
          if (idx === -1) throw new Error('Not found');
          reviews[idx] = { ...reviews[idx], ...data } as Review;
          return reviews[idx];
        }),
      },
    },
  };
});

/** Mock RBAC helper. By default returns null (admin). */
jest.mock('@/lib/auth', () => ({
  __esModule: true,
  requireAdmin: jest.fn(() => null),
}));

const jsonRequest = (method: string, url: string, body?: unknown): NextRequest => {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return new NextRequest(new Request(url, init));
};

// -------------- Tests --------------

describe('/api/admin/reviews route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns paginated list filtered by status', async () => {
    const res = await getReviews(new Request('http://localhost/api/admin/reviews?status=approved'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.items).toHaveLength(1);
    expect(json.total).toBe(1);
    expect(json.items[0].id).toBe('r2');
  });

  it('PATCH updates status when admin', async () => {
    const body = { status: 'approved' } as const;
    const req = jsonRequest('PATCH', 'http://localhost/api/admin/reviews/r1', body);
    const res = await patchReview(req, { params: Promise.resolve({ id: 'r1' }) });
    expect(res.status).toBe(200);
    const updated = (await res.json()) as Review;
    expect(updated.status).toBe('approved');
  });

  it('PATCH blocked for non-admin', async () => {
    // make requireAdmin return forbidden response
    const { requireAdmin } = jest.requireMock('@/lib/auth');
    requireAdmin.mockImplementation(() => new Response(null, { status: 403 }));

    const body = { status: 'rejected' };
    const req = jsonRequest('PATCH', 'http://localhost/api/admin/reviews/r2', body);
    const res = await patchReview(req, { params: Promise.resolve({ id: 'r2' }) });
    expect(res.status).toBe(403);
  });
});
