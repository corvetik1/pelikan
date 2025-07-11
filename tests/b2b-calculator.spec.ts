import { test, expect } from '@playwright/test';

// e2e happy-path for B2B calculator

test.describe('B2B calculator', () => {
  test('user can add item and request quote', async ({ page }) => {
    // stub backend endpoints to avoid real DB dependency
    const prodId = `p-${Date.now()}`;
    const stubProduct = { id: prodId, name: 'Test Fish', slug: 'test-fish', price: 500, img: '' };
    const stubPrice = { id: prodId, price: 500 };
    await page.route('**/api/products', (route) => route.fulfill({ status:200, body: JSON.stringify([stubProduct]), contentType:'application/json' }));
    await page.route('**/api/b2b/prices', (route) => route.fulfill({ status:200, body: JSON.stringify([stubPrice]), contentType:'application/json' }));
    await page.route('**/api/quotes', async (route, request) => {
      if (request.method() === 'POST') {
        route.fulfill({ status:201, body: JSON.stringify({ id:'q-1' }), contentType:'application/json' });
      } else {
        route.continue();
      }
    });
    await page.route('**/api/quotes/q-1', (route) => route.fulfill({ status:200, body: JSON.stringify({ id:'q-1', status:'priced', prices:{ [prodId]: 500 } }), contentType:'application/json' }));

    await page.goto('/b2b/calculator', { waitUntil: 'domcontentloaded' });

    // open add item dialog
    await page.getByTestId('open-add-item').click();

    // select first product option
    // open select via test id to avoid strict mode violation
    await page.getByTestId('add-item-product-select').click();
    const firstOption = await page.getByTestId(/^add-item-option-/).first();
    const productName = await firstOption.textContent();
    await firstOption.click();

    // quantity 2
    await page.locator('[data-testid="add-item-qty-input"] input').fill('2');

    // confirm add
    await page.getByTestId('add-item-confirm').click();

    // email (after dialog closed so field is accessible)
    await page.locator('input[type="email"]').fill('test@example.com');

    // row appears
    await expect(page.getByText(productName || '')).toBeVisible();

    // request quote (wait until enabled)
    const requestBtn = page.getByTestId('request-quote');
    await expect(requestBtn).toBeEnabled();
    await requestBtn.click();

    // snackbar confirms (ru message)
    await expect(page.getByText('Коммерческое предложение готово')).toBeVisible({ timeout: 20_000 });
  });
});
