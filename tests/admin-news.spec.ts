import { test, expect, type Route, type Request } from '@playwright/test';

test.describe('Admin News', () => {
  test.setTimeout(180_000);
  test.skip('CRUD happy path', async ({ page }) => {
    // --- network stubs ---
    const items: any[] = [ { id: 'n-1', title: 'Stub', excerpt: 'Stub', date: new Date().toISOString(), category: 'general' } ];

    // List (GET) and Create (POST)
    await page.route('**/api/admin/news', (route: Route, request: Request) => {
      if (request.method() === 'GET') {
        route.fulfill({ status: 200, body: JSON.stringify(items), contentType: 'application/json' });
      } else if (request.method() === 'POST') {
        const body = JSON.parse(request.postData() || '{}');
        const created = { id: `n-${Date.now()}`, ...body };
        items.push(created);
        route.fulfill({ status: 201, body: JSON.stringify(created), contentType: 'application/json' });
      } else {
        route.continue();
      }
    });

    // Operations on individual item /news/:id
    await page.route('**/api/admin/news/*', (route: Route, request: Request) => {
      const method = request.method();
      if (method === 'GET') {
        const itemId = request.url().split('/').pop();
        const item = items.find(item => item.id === itemId);
        route.fulfill({ status: 200, body: JSON.stringify(item), contentType: 'application/json' });
      } else if (method === 'PATCH') {
        const body = JSON.parse(request.postData() || '{}');
        const itemId = request.url().split('/').pop();
        const item = items.find(item => item.id === itemId);
        if (item) {
          Object.assign(item, body);
        }
        route.fulfill({ status: 200, body: JSON.stringify(item), contentType: 'application/json' });
      } else if (method === 'DELETE') {
        const itemId = request.url().split('/').pop();
        const index = items.findIndex(item => item.id === itemId);
        if (index !== -1) {
          items.splice(index, 1);
        }
        route.fulfill({ status: 200, body: JSON.stringify({ ok: true }), contentType: 'application/json' });
      } else {
        route.continue();
      }
    });

    // Set admin cookie for middleware auth
    await page.context().addCookies([{
      name: 'session',
      value: 'admin',
      domain: 'localhost',
      path: '/'
    }]);

    // set admin user in localStorage for UI state
    await page.addInitScript(() => {
      localStorage.setItem('app_user', JSON.stringify({ id: 'admin', name: 'Admin', roles: ['admin'] }));
    });

    // go directly to admin/news (no query param needed with cookie)
    await page.goto('/admin/news', { waitUntil: 'domcontentloaded' });

    // ensure page loaded
    await expect(page.getByRole('heading', { name: 'Новости' })).toBeVisible({ timeout: 40_000 });

    // wait for grid loaded
    await expect(page.getByTestId('add-news-btn')).toBeEnabled();

    // ADD
    await page.getByTestId('add-news-btn').click({ force: true });
    // Wait for dialog to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
    await page.getByRole('textbox', { name: 'Заголовок' }).fill('Playwright News');
    await page.getByRole('textbox', { name: 'Анонс' }).fill('E2E created');
    // date already set
    await page.getByRole('button', { name: /сохранить/i }).click();

    // row appears
    await expect(page.getByText('Playwright News')).toBeVisible({ timeout: 10_000 });

    // EDIT (double click to edit title cell)
    await page.getByText('Playwright News').dblclick();
    await page.keyboard.type(' Updated');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Playwright News Updated')).toBeVisible();

    // DELETE (first row delete icon)
    // delete specifically the updated row
    const updatedRow = page.getByRole('row', { name: /Playwright News Updated/ });
    await updatedRow.getByRole('button', { name: /delete/i }).click();
    // confirm dialog appears
    await page.getByRole('button', { name: 'Удалить' }).click();

    // дождаться снэкбара "Удалено"
    await expect(page.getByText('Удалено')).toBeVisible();

    // строка с Playwright News Updated исчезла
    await expect(page.locator('text=Playwright News Updated')).toHaveCount(0, { timeout: 10_000 });
  });
});
