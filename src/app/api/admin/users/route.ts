import { NextResponse } from 'next/server';
import type { AdminUser } from '@/types/admin';

// initial mock users list (can be empty)
const initial: AdminUser[] = [
  {
    id: 'u1',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    email: 'editor@example.com',
    role: 'editor',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const storeKey = '__mock_users__' as const;

type UserStore = AdminUser[];

const globalForUsers = globalThis as typeof globalThis & {
  [storeKey]: UserStore;
};

if (!globalForUsers[storeKey]) {
  globalForUsers[storeKey] = JSON.parse(JSON.stringify(initial)) as UserStore;
}

const users: UserStore = globalForUsers[storeKey];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = `u${Date.now()}`;
  const newUser: AdminUser = { id, createdAt: new Date().toISOString(), ...body };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
