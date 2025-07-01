import { test, expect } from '@playwright/test';

// e2e happy-path for B2B calculator

test.describe('B2B calculator', () => {
  test('user can add item and request quote', async ({ page }) => {
    await page.goto('/b2b/calculator');

    // open add item dialog
    await page.getByTestId('open-add-item').click();

    // select first product option
    await page.getByLabel('Товар').click();
    const firstOption = await page.getByTestId(/^add-item-option-/).first();
    const productName = await firstOption.textContent();
    await firstOption.click();

    // quantity 2
    const qtyInput = page.getByTestId('add-item-qty-input');
    await qtyInput.fill('2');

    // confirm
    await page.getByTestId('add-item-confirm').click();

    // row appears
    await expect(page.getByText(productName || '')).toBeVisible();

    // request quote
    const requestBtn = page.getByTestId('request-quote');
    await requestBtn.click();

    // snackbar confirms (ru message)
    await expect(page.getByText('Коммерческое предложение готово')).toBeVisible();
  });
});
