// Rely on global Jest typings (configured in tsconfig "types").

// Mock server deps
jest.mock('@/lib/auth', () => ({ requireAdmin: jest.fn() }));
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: { subscriber: { findMany: jest.fn() } } }));
jest.mock('@/lib/errorHandler', () => ({ handleError: (e: Error | string) => new Response(String(e), { status: 500 }) }));

import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { GET } from '@/app/api/admin/subscribers/export/route';

describe('GET /api/admin/subscribers/export', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns CSV with headers and filters by status', async () => {
    (requireAdmin as jest.MockedFunction<(req: Request) => Response | undefined>).mockImplementation(() => undefined);
    (prisma.subscriber.findMany as jest.MockedFunction<typeof prisma.subscriber.findMany>).mockResolvedValueOnce(
      [
        { id: 's1', email: 'a@a.com', status: 'subscribed', createdAt: new Date('2024-01-01T00:00:00.000Z'), confirmedAt: null },
        { id: 's2', email: 'b@b.com', status: 'subscribed', createdAt: new Date('2024-01-02T00:00:00.000Z'), confirmedAt: null },
      ] as Awaited<ReturnType<typeof prisma.subscriber.findMany>>,
    );

    const url = new URL('http://localhost/api/admin/subscribers/export?status=subscribed');
    const res = await GET(new Request(url.toString()));

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    expect(res.headers.get('content-disposition')).toContain('subscribers.csv');
    expect(res.headers.get('cache-control')).toBe('no-store');

    const text = await res.text();
    expect(text.split('\n')[0]).toBe('email,status,createdAt');
    expect(text).toContain('a@a.com,subscribed,2024-01-01T00:00:00.000Z');
  });

  it('respects unauthorized via requireAdmin', async () => {
    const unauthorized = new Response('unauthorized', { status: 401 });
    (requireAdmin as jest.MockedFunction<(req: Request) => Response | undefined>).mockImplementation(() => unauthorized);

    const res = await GET(new Request('http://localhost/api/admin/subscribers/export'));
    expect(res.status).toBe(401);
  });
});
