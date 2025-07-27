import { test, expect, type Route, type Request } from '@playwright/test';

// E2E happy-path for admin recipes CRUD

test.describe('Admin Recipes', () => {
  test.skip('create — edit — delete', async ({ page }) => {
    /* ---------------- network stubs ---------------- */
    const items: any[] = [
      {
        id: 'r-1',
        title: 'Stub Soup',
        category: 'soups',
        cookingTime: 15,
        shortDescription: 'Stub item',
        img: '',
      },
    ];

    // list + create (collection endpoint)
    await page.route('**/api/admin/recipes**', (route: Route, request: Request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          body: JSON.stringify(items),
          contentType: 'application/json',
        });
      }
      if (request.method() === 'POST') {
        const body = JSON.parse(request.postData() || '{}');
        const created = { id: `r-${Date.now()}`, ...body };
        items.push(created);
        return route.fulfill({ status: 201, body: JSON.stringify(created), contentType: 'application/json' });
      }
      return route.continue();
    });

    // item endpoint (PATCH / DELETE)
    await page.route('**/api/admin/recipes/*', (route: Route, request: Request) => {
      const method = request.method();
      const recipeId = request.url().split('/').pop()!;
      if (method === 'PATCH') {
        const body = JSON.parse(request.postData() || '{}');
        const item = items.find((it) => it.id === recipeId);
        if (item) Object.assign(item, body);
        return route.fulfill({ status: 200, body: JSON.stringify(item), contentType: 'application/json' });
      }
      if (method === 'DELETE') {
        const idx = items.findIndex((it) => it.id === recipeId);
        if (idx !== -1) items.splice(idx, 1);
        return route.fulfill({ status: 200, body: JSON.stringify({ ok: true }), contentType: 'application/json' });
      }
      return route.continue();
    });

    /* ---------------- auth ---------------- */
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

    /* ---------------- navigation ---------------- */
    await page.goto('/admin/recipes', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Рецепты' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Добавить' })).toBeEnabled();

    /* ---------------- create ---------------- */
    await page.getByRole('button', { name: '+ Добавить' }).click({ force: true });
    // Wait for dialog to appear
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
    await page.getByRole('textbox', { name: 'Название' }).fill('Playwright Recipe');
    // категория оставляем значение по умолчанию
    await page.getByRole('spinbutton', { name: /время/i }).fill('42');
    await page.getByRole('textbox', { name: 'Описание' }).fill('E2E created');
    await page.getByRole('button', { name: /сохранить/i }).click();

    await expect(page.getByText('Playwright Recipe')).toBeVisible();

    /* ---------------- edit title inline ---------------- */
    await page.getByText('Playwright Recipe').dblclick();
    await page.keyboard.type(' Updated');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Playwright Recipe Updated')).toBeVisible();

    /* ---------------- delete ---------------- */
    const updatedRow = page.getByRole('row', { name: /Playwright Recipe Updated/ });
    await updatedRow.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: 'Удалить' }).click();

    await expect(page.getByText('Удалено')).toBeVisible();
    await expect(page.locator('text=Playwright Recipe Updated')).toHaveCount(0);
  });
});
