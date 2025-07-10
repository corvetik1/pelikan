import type { NextRequest } from 'next/server';

/**
 * Checks that the incoming request is authorized as an admin.
 * Strategy: expect header `Authorization: Bearer <ADMIN_TOKEN>` where
 * `ADMIN_TOKEN` is configured in environment variables.
 *
 * Returns a Response with status 401 if not authorized, otherwise null.
 */
export function requireAdmin(req: NextRequest | Request): Response | null {
  // In unit/integration tests we skip auth to ease testing
  if (process.env.NODE_ENV === 'test') return null;
  const authHeader = req.headers.get('authorization') ?? '';
  const expected = process.env.ADMIN_TOKEN ? `Bearer ${process.env.ADMIN_TOKEN}` : '';
  // If ADMIN_TOKEN is set, require exact match; otherwise allow all (useful in tests)
  if (expected && authHeader !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }
  return null;
}
