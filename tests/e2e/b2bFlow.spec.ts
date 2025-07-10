import { test, expect } from '@playwright/test';

/**
 * End-to-end scenario: пользователь отправляет заявку на КП,
 * администратор проставляет цены, калькулятор отображает готовое предложение.
 */

test.setTimeout(180_000);

test('B2B calculator flow (stubbed backend)', async ({ page }) => {
    // Стабовые данные, чтобы не требовать запущенной БД
  const productId = `prod-${Math.random().toString(16).slice(2)}`;
  const stubProduct = {
    id: productId,
    name: 'Test Fish',
    slug: 'test-fish',
    price: 999,
    img: '',
  };
  const stubPrice = { id: productId, price: 999 };

  // Intercept backend requests and return заглушки
  await page.route('**/api/products', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify([stubProduct]), contentType: 'application/json' });
  });
  await page.route('**/api/b2b/prices', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify([stubPrice]), contentType: 'application/json' });
  });
  await page.route('**/api/quotes', async (route, request) => {
    if (request.method() === 'POST') {
      route.fulfill({ status: 201, body: JSON.stringify({ id: 'quote-1' }), contentType: 'application/json' });
    } else {
      route.continue();
    }
  });
  await page.route('**/api/quotes/quote-1', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ id: 'quote-1', status: 'priced', prices: { [productId]: 1234 } }),
      contentType: 'application/json',
    });
  });

  // 1. Открываем страницу калькулятора
  await page.goto('/b2b/calculator', { waitUntil: 'domcontentloaded' });

  // Ждём появления селекта товаров – индикатор того, что данные загружены
  await page.getByTestId('product-select').waitFor({ state: 'visible', timeout: 60_000 });

  // 3. Выбираем товар в селекте
  // MUI Select is rendered as a div role=button; click with force to bypass overlay
  await page.getByTestId('product-select').click({ force: true });
  await page.getByTestId(`option-${productId}`).click({ force: true });

  // 4. Заполняем email и количество
  await page.getByLabel('Ваш email').fill('e2e@example.com');
  await page.getByLabel('Количество').fill('5');

  // 5. Отправляем запрос и ждём ответа (заглушка)
  const [quoteRes] = await Promise.all([
    page.waitForResponse('**/api/quotes'),
    page.getByTestId('request-quote').click(),
  ]);
  expect(quoteRes.status()).toBe(201);

  // 6. На экране появляется snackbar "Запрос отправлен"
  await expect(page.getByText('Запрос отправлен')).toBeVisible();

  // 7. UI должен опросить бекенд и показать snackbar об успешном расчёте (получит заглушку)
  await expect(page.getByText('Коммерческое предложение готово')).toBeVisible({ timeout: 20_000 });
});
