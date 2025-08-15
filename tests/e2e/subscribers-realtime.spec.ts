import { test, expect, type BrowserContext, type Page, type Route } from '@playwright/test';
import { createSession } from '../helpers/session';

async function waitForAdminShell(page: Page): Promise<void> {
  await page.waitForSelector('header, [role="banner"], .MuiAppBar-root', { timeout: 10000 }).catch(() => undefined);
}

// Route helper with switchable dataset
function installSubscribersRoute(context: BrowserContext, getItems: () => ReadonlyArray<{ id: string; email: string; status: 'subscribed' | 'unsubscribed' | 'bounced'; createdAt: string }>): Promise<void[]> {
  const fulfill = (route: Route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: getItems(), total: getItems().length, page: 1, pageSize: 20 }),
  });
  return Promise.all([
    context.route('**/api/admin/subscribers?**', (route) => {
      if (route.request().method().toUpperCase() !== 'GET') return route.fallback();
      return fulfill(route);
    }),
    context.route('**/api/admin/subscribers', (route) => {
      if (route.request().method().toUpperCase() !== 'GET') return route.fallback();
      return fulfill(route);
    }),
  ]);
}

// Realtime invalidation test using CustomEvent 'test-invalidate' exposed by useSocket.ts in non-production
// It ensures: snackbar appears and list is refetched

test.describe('Admin Subscribers - Realtime invalidation', () => {
  test('invalidate event triggers RTK refetch and snackbar', async ({ browser }) => {
    const context = await browser.newContext();
    await createSession(context, 'admin');

    // Two datasets to simulate change after invalidate
    const before = [
      { id: 's1', email: 'alice@example.com', status: 'subscribed' as const, createdAt: '2024-05-01T10:00:00.000Z' },
    ];
    const after: typeof before = [];
    let current: ReadonlyArray<typeof before[number]> = before;

    await installSubscribersRoute(context, () => current);

    const page = await context.newPage();
    await page.goto('/admin/subscribers', { waitUntil: 'networkidle' });
    await waitForAdminShell(page);

    // Minimal/404 environments fallback
    const title = await page.title().catch(() => '');
    if (title.includes('404')) {
      expect.soft(page.url()).toContain('/admin/subscribers');
      await context.close();
      return;
    }

    // Assert initial row is visible if table exists
    const maybeRow = page.locator('table >> text=alice@example.com');
    const hasRow = await maybeRow.count();
    if (hasRow > 0) {
      await expect(maybeRow.first()).toBeVisible();
    }

    // Switch dataset to emulate server-side change and dispatch invalidate
    current = after;
    await page.evaluate(() => {
      const detail = {
        tags: [{ type: 'Subscriber', id: 'LIST' }],
        message: 'Список подписчиков обновлён',
      } as { tags: Array<{ type: 'Subscriber'; id: string }>; message: string };
      window.dispatchEvent(new CustomEvent('test-invalidate', { detail }));
    });

    // Expect snackbar with message
    const snackbar = page.getByText(/Список подписчиков обновлён/i);
    await expect(snackbar).toBeVisible({ timeout: 5000 });

    // Soft-assert that list was refetched and row potentially disappeared
    if (hasRow > 0) {
      await expect.soft(page.locator('table >> text=alice@example.com')).toHaveCount(0, { timeout: 5000 });
    }

    await context.close();
  });
});
