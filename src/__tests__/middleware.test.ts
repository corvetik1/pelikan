import { NextResponse } from 'next/server';
import { middleware } from '../../middleware';

// Helper to create a minimal mock of NextRequest
const createRequest = (url: string, cookie?: string, authHeader?: string) => {
  const headers: Record<string, string> = {};
  if (authHeader) headers['authorization'] = authHeader;
  return {
    url,
    headers, // used by requireRole
    cookies: {
      get: (name: string) =>
        cookie && name === 'session' ? { value: cookie } : undefined,
    },
    nextUrl: new URL(url),
  } as unknown as Parameters<typeof middleware>[0];
};

describe('middleware /admin protection', () => {
  it('redirects guest to /login', () => {
    const req = createRequest('http://localhost/admin');
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res?.headers.get('location')).toBe('http://localhost/login?next=%2Fadmin');
  });

  it('allows admin with cookie', () => {
    const req = createRequest('http://localhost/admin', 'admin');
    const res = middleware(req);
    expect(res).toBeUndefined(); // no redirect => access granted
  });

  it('allows access with valid bearer token', () => {
    process.env.ADMIN_TOKEN = 'tok';
    const req = createRequest('http://localhost/admin', undefined, 'Bearer tok');
    const res = middleware(req);
    expect(res).toBeUndefined();
  });

  it('redirects when role mismatch', () => {
    const cookieValue = encodeURIComponent(JSON.stringify({ id: 'u1', roles: ['editor'] }));
    const req = createRequest('http://localhost/admin', cookieValue);
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res?.headers.get('location')).toContain('/login');
  });
});
