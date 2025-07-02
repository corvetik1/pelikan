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

  let patch: Partial<AdminUser>;
  try {
    patch = (await req.json()) as Partial<AdminUser>;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  // validate allowed fields
  const allowedKeys: (keyof AdminUser)[] = ['email', 'role', 'isActive'];
  const invalidKey = Object.keys(patch).find((k) => !allowedKeys.includes(k as keyof AdminUser));
  if (invalidKey) {
    return NextResponse.json({ message: `Invalid field: ${invalidKey}` }, { status: 400 });
  }

  if (patch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.email)) {
    return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
  }

  if (patch.role && !['admin', 'editor', 'viewer'].includes(patch.role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  if (patch.isActive !== undefined && typeof patch.isActive !== 'boolean') {
    return NextResponse.json({ message: 'Invalid isActive flag' }, { status: 400 });
  }

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
