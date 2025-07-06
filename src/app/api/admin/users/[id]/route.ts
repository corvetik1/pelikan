import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Prisma, User } from '@prisma/client';

/**
 * Admin Users item API
 * PATCH /api/admin/users/[id] – update user
 * DELETE /api/admin/users/[id] – delete user
 */

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const patch = (await req.json()) as Prisma.UserUncheckedUpdateInput;

  // validation
  if (typeof patch.email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.email)) {
    return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  }
  if (typeof patch.role === 'string' && !['admin', 'editor', 'viewer'].includes(patch.role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  try {
    const updated: User = await prisma.user.update({ where: { id }, data: patch });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const removed: User = await prisma.user.delete({ where: { id } });
    return NextResponse.json(removed);
  } catch {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
}
