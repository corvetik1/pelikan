import { NextResponse } from 'next/server';
import { middleware } from '../../middleware';

// Helper to create a minimal mock of NextRequest
const createRequest = (url: string, cookie?: string) => {
  return {
    url,
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
    expect(res?.headers.get('location')).toBe('http://localhost/login?next=/admin');
  });

  it('allows admin with cookie', () => {
    const req = createRequest('http://localhost/admin', 'admin');
    const res = middleware(req);
    expect(res).toBeUndefined(); // no redirect => access granted
  });
});
