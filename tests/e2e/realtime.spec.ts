import { test, expect, type Page, type Route, type Request, type BrowserContext } from '@playwright/test';

/**
 * Smoke-тест realtime-инвалидации между двумя вкладками админ-панели.
 * Симулируем обновление списка товаров и проверяем, что вторая вкладка
 * автоматически перезапрашивает данные и показывает snackbar.
 */

test.describe('Realtime invalidation – parallel tabs', () => {
  test.setTimeout(120_000);

  test('invalidate across tabs refreshes data & shows snackbar', async ({ browser }) => {
    // Shared in-memory list живёт только в тесте
    const items: Array<{ id: string; name: string }> = [
      { id: 'p-1', name: 'Apple' },
    ];

    // Helper: fulfil GET /api/admin/products c текущими items
    const fulfillProducts = async (route: Route, _request: Request) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(items),
        contentType: 'application/json',
      });
    };

    // Создаём контекст с кукой admin session
    const context: BrowserContext = await browser.newContext();
    await context.addCookies([
      {
        name: 'session',
        value: 'admin',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Ставим роуты до открытия страниц
    await context.route('**/api/admin/products', fulfillProducts);
    await context.route('**/api/admin/products?*', fulfillProducts);

    // Вкладка 1
    const page1 = await context.newPage();
    await injectAdminLocalStorage(page1);
    await page1.goto('/admin/products', { waitUntil: 'domcontentloaded' });
    await expect(page1.getByText('Apple')).toBeVisible();

    // Вкладка 2
    const page2 = await context.newPage();
    await injectAdminLocalStorage(page2);
    await page2.goto('/admin/products', { waitUntil: 'domcontentloaded' });
    await expect(page2.getByText('Apple')).toBeVisible();

    // --- Мутация данных + инвалидация ---
    items.push({ id: 'p-2', name: 'Banana' });

    // Триггерим invalidate из первой вкладки (снэкбар появится только там, debounce в коде)
    await page1.evaluate(() => {
      // @ts-ignore
      window.__socket__?.emit('invalidate', {
        tags: [{ type: 'AdminProduct', id: 'LIST' }],
        message: 'Данные обновлены',
      });
    });

    // Во второй вкладке ждём появления нового товара и snackbar
    await expect(page2.getByText('Banana')).toBeVisible({ timeout: 10_000 });
    await expect(page2.getByText('Данные обновлены')).toBeVisible();
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
