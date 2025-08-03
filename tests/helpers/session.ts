import { BrowserContext, Page } from '@playwright/test';

/**
 * Create auth session for given role by writing both cookie `session` and
 * localStorage `app_user` before the first page is created.
 */
export async function createSession(context: BrowserContext, role: 'guest' | 'editor' | 'admin'): Promise<void> {
  if (role === 'guest') return; // nothing to do

  const user = { id: role, name: role.charAt(0).toUpperCase() + role.slice(1), roles: [role] } as const;

  // Cookie – used by API routes (Next.js middleware)
  await context.addCookies([
    {
      name: 'session',
      value: encodeURIComponent(JSON.stringify(user)),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // LocalStorage – used by client-side auth provider
  await context.addInitScript((u) => {
    localStorage.setItem('app_user', JSON.stringify(u));
  }, user);
}

/**
 * Inject admin localStorage in already created page (fallback for legacy tests).
 */
export async function injectAdminLocalStorage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'app_user',
      JSON.stringify({ id: 'admin', name: 'Admin', roles: ['admin'] }),
    );
  });
}
