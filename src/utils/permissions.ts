// Centralized helpers for role & permission checks. Pure functions to facilitate unit testing.
// All permission strings are case-sensitive. Wild-cards are supported with `*` in the action part,
// e.g. `news:*` covers `news:create`, `news:update`, etc.
// No `any`/`unknown`/`@ts-ignore` are used – strict type safety is preserved.

export type Permission = `${string}:${string}` | '*';

export type RoleName = 'admin' | 'editor' | 'viewer' | string;

/**
 * Mapping of built-in roles to permission patterns.
 * NOTE: these are duplicated on the client for convenience;
 * in production they should come from the backend `GET /api/admin/roles`.
 */
export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  admin: ['*'],
  editor: [
    'news:*',
    'recipes:*',
    'stores:*',
    'products:*',
  ],
  viewer: [],
};

/**
 * Check if a permission pattern matches a concrete permission.
 * Supports wildcard `*` either in the whole pattern or after the colon.
 */
export const permissionMatches = (pattern: Permission, permission: string): boolean => {
  if (pattern === '*') return true;
  const [entityPattern, actionPattern] = pattern.split(':', 2);
  const [entity, action] = permission.split(':', 2);
  const entityOk = entityPattern === entity || entityPattern === '*';
  const actionOk = actionPattern === action || actionPattern === '*';
  return entityOk && actionOk;
};

/**
 * Flatten all permission patterns for the provided role list.
 */
export const getPermissionsForRoles = (roles: RoleName[]): Permission[] => {
  const aggregated = roles.flatMap((r) => ROLE_PERMISSIONS[r] ?? []);
  // If at least one pattern is global `*` we can shortcut.
  return aggregated.includes('*') ? ['*'] : aggregated;
};

/**
 * Determine if user with given roles grants the required permission.
 */
export const hasPermission = (roles: RoleName[], permission: string): boolean => {
  const perms = getPermissionsForRoles(roles);
  if (perms.includes('*')) return true;
  return perms.some((pattern) => permissionMatches(pattern, permission));
};
