import { NextResponse, type NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';

/**
 * Global middleware: защищает все /admin* маршруты.
 * Если session cookie отсутствует или не содержит role=admin – редирект на /login.
 */
export function middleware(req: NextRequest) {
  // Проверяем только admin-роуты
  if (!req.nextUrl.pathname.startsWith('/admin')) return;

  // Пытаемся авторизовать по ролям
  const auth = requireRole(req, ['admin', 'ADMIN']);
  if (auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
