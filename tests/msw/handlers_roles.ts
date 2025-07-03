import { rest } from 'msw';
import type { AdminRole } from '@/types/admin';

export const sampleRoles: AdminRole[] = [
  { id: 'r1', name: 'Role1', description: 'desc', permissions: ['read'] },
  { id: 'r2', name: 'Role2', description: 'desc2', permissions: ['write'] },
];

let roles: AdminRole[] = [...sampleRoles];

export const resetRoles = (): void => {
  roles = [...sampleRoles];
};

// Universal match for any scheme/host so that Node fetch (http://localhost) and browser fetch are handled
const listPattern = '*://*/api/admin/roles';
const itemPattern = '*://*/api/admin/roles/:id';

export const handlers = [
  // READ roles
  rest.get(listPattern, (_req, res, ctx) => {
    // eslint-disable-next-line no-console
    console.log('MSW GET roles', roles.map(r=>r.id));
    return res(ctx.status(200), ctx.json(roles));
  }),

  // CREATE role
  rest.post(listPattern, async (req, res, ctx) => {
    const data = (await req.json()) as Partial<AdminRole>;
    const role: AdminRole = {
      id: `r${Date.now()}`,
      name: data.name ?? 'NewRole',
      description: data.description ?? '',
      permissions: data.permissions ?? [],
    };
    roles.push(role);
    return res(ctx.status(201), ctx.json(role));
  }),

  // UPDATE role
  rest.patch(itemPattern, async (req, res, ctx) => {
    const id = (req.params as any)?.id ?? req.url.pathname.split('/').pop() ?? '';
    const patch = (await req.json()) as Partial<AdminRole>;
    const idx = roles.findIndex((r) => r.id === id);
    if (idx === -1) return res(ctx.status(404));
    roles[idx] = { ...roles[idx], ...patch } as AdminRole;
    return res(ctx.json(roles[idx]));
  }),

  // DELETE role
  rest.delete(itemPattern, (req, res, ctx) => {
    const id = (req.params as any)?.id ?? req.url.pathname.split('/').pop() ?? '';
    // eslint-disable-next-line no-console
    console.log('MSW DELETE id', id);
    roles = roles.filter((r) => r.id !== id);
    // eslint-disable-next-line no-console
    console.log('Roles after delete', roles.map(r=>r.id));
    return res(ctx.json({ ok: true }));
  }),
];
