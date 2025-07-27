import { requireRole } from '@/lib/auth';

jest.mock('next/headers', () => ({ cookies: () => ({ get: () => undefined }) }));

const ORIGINAL_NODE_ENV = process.env['NODE_ENV'];
const ORIGINAL_ADMIN_TOKEN = process.env['ADMIN_TOKEN'];

afterEach(() => {
  Object.assign(process.env, { NODE_ENV: ORIGINAL_NODE_ENV });
  Object.assign(process.env, { ADMIN_TOKEN: ORIGINAL_ADMIN_TOKEN });
});

function createRequest(cookie?: string, authHeader?: string): Request {
  const headers: Record<string, string> = {};
  if (authHeader) headers['authorization'] = authHeader;
  if (cookie) headers['cookie'] = `session=${cookie}`;
  return new Request('http://localhost/api', { headers });
}

describe('requireRole', () => {
  it('allows bearer token matching ADMIN_TOKEN', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    Object.assign(process.env, { ADMIN_TOKEN: 'secret123' });

    const req = createRequest(undefined, 'Bearer secret123');
    expect(requireRole(req, ['admin'])).toBeNull();
  });

  it('allows JSON session cookie with correct role', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    const cookieValue = encodeURIComponent(
      JSON.stringify({ id: 'u1', roles: ['admin', 'editor'] }),
    );
    const req = createRequest(cookieValue);
    expect(requireRole(req, ['admin'])).toBeNull();
  });

  it('allows legacy string "admin" cookie', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    const req = createRequest('admin');
    expect(requireRole(req, ['admin'])).toBeNull();
  });

  it('returns 401 when unauthenticated', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    const res = requireRole(createRequest(), ['admin']);
    expect(res?.status).toBe(401);
  });

  it('returns 403 when authenticated but missing role', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    const cookieValue = encodeURIComponent(
      JSON.stringify({ id: 'u1', roles: ['editor'] }),
    );
    const res = requireRole(createRequest(cookieValue), ['admin']);
    expect(res?.status).toBe(403);
  });
});
