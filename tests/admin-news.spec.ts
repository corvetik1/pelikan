import { test, expect } from '@playwright/test';

test.describe('Admin News', () => {
  test('CRUD happy path', async ({ page }) => {
    // go directly to admin/news
    await page.goto('/admin/news');

    // ensure page loaded
    await expect(page.getByRole('heading', { name: 'Новости' })).toBeVisible();

    // ADD
    await page.getByTestId('add-news-btn').click();
    await page.getByLabel('Заголовок').fill('Playwright News');
    await page.getByLabel('Анонс').fill('E2E created');
    // date already set
    await page.getByRole('button', { name: /сохранить/i }).click();

    // row appears
    await expect(page.getByText('Playwright News')).toBeVisible();

    // EDIT (double click to edit title cell)
    await page.getByText('Playwright News').dblclick();
    await page.keyboard.type(' Updated');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Playwright News Updated')).toBeVisible();

    // DELETE (first row delete icon)
    const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
    await deleteBtn.click();
    // confirm handled in UI without modal; row removed
    await expect(page.getByText('Playwright News Updated')).not.toBeVisible();
  });
});
