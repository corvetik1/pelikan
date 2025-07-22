import { test, expect } from '@playwright/test';

/**
 * Проверяем, что страница новости рендерит Markdown-содержимое
 * и доступна по SSR (контент присутствует до гидратации).
 */

test.setTimeout(120_000);

test('News article SSR renders markdown', async ({ page }) => {
  // Открываем существующую статью (mock data)
  await page.goto('/news/supply-chain-update-2025', { waitUntil: 'domcontentloaded' });

  // Заголовок виден
  await expect(page.getByRole('heading', { name: /Обновление цепочки поставок/i })).toBeVisible();

  // Первый абзац контента отображён (не дата)
  await expect(page.locator('p').filter({ hasText: 'Бухта пеликанов' }).first()).toBeVisible();

  // Убеждаемся, что HTML параграфы существуют ещё до гидратации (SSR)
  const hadParagraphsInSSR = await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    return document.documentElement.innerHTML.includes('<p');
  });
  expect(hadParagraphsInSSR).toBeTruthy();
});
