import { NextRequest, NextResponse } from 'next/server';

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginBody;
  const { email, password } = body;

  // Простейшая проверка – в проде заменить на Prisma + bcrypt
  if (email === 'admin@pelikan.local' && password === 'admin123') {
    const res = NextResponse.json({ success: true });
    // Ставим cookie session=admin, HttpOnly, Path=/, на 1 день
    res.cookies.set({
      name: 'session',
      value: 'admin',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
