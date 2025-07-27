import prisma from '@/lib/prisma';
import { z } from 'zod';
import { handleError } from '@/lib/handleError';
import { withLogger } from '@/lib/logger';
import { withInvalidate } from '@/lib/withInvalidate';
import type { User } from '@prisma/client';

/**
 * Admin Users API
 * GET  /api/admin/users   – list users
 * POST /api/admin/users   – create user
 */

// GET /api/admin/users – список пользователей
export const GET = withLogger(async () => {
  const list: User[] = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { roles: true },
  });
  return Response.json(list);
});

// Валидация входных данных для создания пользователя
const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(64).optional(),
  role: z.enum(['admin', 'viewer', 'editor']).optional(),
  isActive: z.boolean().optional(),
});

// POST /api/admin/users – создать пользователя
export const POST = withLogger(
  withInvalidate([{ type: 'AdminUser', id: 'LIST' }], 'Пользователь создан')(
    async (request: Request) => {
      try {
        const payload = await request.json();
        const data = UserCreateSchema.parse(payload);

        // Определяем связь с ролью, если она указана
        const roleConnect = data.role
          ? await (async () => {
              const role = await prisma.role.findUnique({ where: { name: data.role } });
              if (!role) throw new Error(`Role ${data.role} not found`);
              return { roles: { connect: { id: role.id } } } as const;
            })()
          : {};

        const created: User = await prisma.user.create({
          data: {
            email: data.email,
            password: data.password,
            name: data.name,
            isActive: data.isActive ?? true,
            ...roleConnect,
          },
          include: { roles: true },
        });

        return Response.json(created, { status: 201 });
      } catch (err) {
        return handleError(err);
      }
    },
  ),
);
