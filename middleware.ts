import { NextResponse, type NextRequest } from 'next/server';

/**
 * Global middleware: защищает все /admin* маршруты.
 * Если session cookie отсутствует или не содержит role=admin – редирект на /login.
 */
export function middleware(req: NextRequest) {
  // Проверяем только admin-роуты
  if (!req.nextUrl.pathname.startsWith('/admin')) return;

  const session = req.cookies.get('session')?.value;
  // Простейший формат cookie: "session=admin". В проде здесь JWT.
  const isAdmin = session === 'admin';

  if (!isAdmin) {
    const loginUrl = new URL('/login', req.url);
    // Сохраняем путь, чтобы вернуться после логина
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
