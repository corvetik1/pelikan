import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma, User } from '@prisma/client';

/**
 * Admin Users API
 * GET  /api/admin/users   – list users
 * POST /api/admin/users   – create user
 */

export async function GET() {
  const list: User[] = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const data = (await request.json()) as Prisma.UserUncheckedCreateInput;

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  }
  if (!data.password || data.password.length < 6) {
    return NextResponse.json({ message: 'Password too short' }, { status: 400 });
  }
  if (data.role && !['admin', 'editor', 'viewer'].includes(data.role as string)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  const created: User = await prisma.user.create({ data });
  return NextResponse.json(created, { status: 201 });
}
