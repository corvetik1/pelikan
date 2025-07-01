import { NextResponse } from 'next/server';
import type { AdminUser } from '@/types/admin';

const storeKey = '__mock_users__' as const;

type UserStore = AdminUser[];

const globalForUsers = globalThis as typeof globalThis & {
  [storeKey]: UserStore;
};

if (!globalForUsers[storeKey]) {
  globalForUsers[storeKey] = [] as UserStore;
}

const users: UserStore = globalForUsers[storeKey];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const patch = await req.json();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  users[idx] = { ...users[idx], ...patch };
  return NextResponse.json(users[idx]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const removed = users.splice(idx, 1)[0];
  return NextResponse.json(removed);
}
