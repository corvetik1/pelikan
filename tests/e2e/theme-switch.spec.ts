import { test, expect, type Route, type Request, type BrowserContext, type Page } from '@playwright/test';

// Minimal light & dark tokens
const lightTokens = { palette: { mode: 'light' } } as const;
const darkTokens = { palette: { mode: 'dark' } } as const;

test.describe('Theme switch (admin settings)', () => {
  test.setTimeout(120_000);

  test('changes active theme and applies on SSR after reload', async ({ browser }) => {
    // --- mutable settings stub ---
    const settings = { id: 1, activeThemeSlug: 'light' };

    // --- themes list stub ---
    const themes = [
      { slug: 'light', name: 'Light', tokens: lightTokens, createdAt: new Date().toISOString() },
      { slug: 'dark', name: 'Dark', tokens: darkTokens, createdAt: new Date().toISOString() },
    ];

    // Routes helpers
    const fulfillJson = (body: unknown) => ({ status: 200, body: JSON.stringify(body), contentType: 'application/json' });

    const context: BrowserContext = await browser.newContext();
    await context.addCookies([
      { name: 'session', value: 'admin', domain: 'localhost', path: '/' },
    ]);

    await context.route('**/api/settings', async (route, request) => {
      if (request.method() === 'PATCH') {
        const body = JSON.parse(request.postData() ?? '{}');
        Object.assign(settings, body);
        await route.fulfill(fulfillJson(settings));
      } else {
        await route.fulfill(fulfillJson(settings));
      }
    });

    await context.route('**/api/admin/themes', (route) => route.fulfill(fulfillJson(themes)));

    const page = await context.newPage();
    await injectAdminLocalStorage(page);

    // Open settings page
    await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });

    // Ensure select shows Light
    await expect(page.getByLabel('Активная тема')).toHaveValue('light');

    // Select Dark theme
    await page.getByLabel('Активная тема').selectOption('dark');
    await page.getByRole('button', { name: 'Сохранить' }).click();

    // Wait for snackbar
    await expect(page.getByText('Настройки сохранены')).toBeVisible();

    // Reload page (SSR)
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Immediately after load background should be dark (no flash)
    const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bgColor).toMatch(/rgb\(18, 18, 18\)/); // default MUI dark background

    // Also select should show dark
    await expect(page.getByLabel('Активная тема')).toHaveValue('dark');
  });
});

// --- helpers ---
async function injectAdminLocalStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'app_user',
      JSON.stringify({ id: 'admin', name: 'Admin', roles: ['admin'] }),
    );
  });
}
