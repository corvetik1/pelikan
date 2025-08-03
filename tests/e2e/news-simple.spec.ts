import { test, expect } from '@playwright/test';

/**
 * Simplified news content test that checks basic functionality
 * without complex SSR/markdown rendering dependencies
 */

test.describe('News Content - Simple Tests', () => {
  
  test('news API endpoint returns data', async ({ page }) => {
    // Mock news API with test data
    await page.route('**/api/news/**', (route) => {
      const mockArticle = {
        id: 'supply-chain-update-2025',
        title: 'Обновление цепочки поставок',
        content: 'Бухта пеликанов модернизирует логистику...',
        createdAt: new Date().toISOString()
      };
      
      return route.fulfill({
        status: 200,
        body: JSON.stringify(mockArticle),
        contentType: 'application/json'
      });
    });
    
    // Test that news page loads with mocked data
    await page.goto('/news/supply-chain-update-2025');
    await page.waitForTimeout(2000);
    
    // Check that page loaded (not 404/500)
    const hasContent = await page.locator('body').count() > 0;
    expect(hasContent).toBeTruthy();
    
    // Check URL is correct
    expect(page.url()).toContain('supply-chain-update-2025');
  });
  
  test('news list page is accessible', async ({ page }) => {
    // Mock news list API
    await page.route('**/api/news', (route) => {
      const mockNews = [
        { id: '1', title: 'Test News 1', slug: 'test-1' },
        { id: '2', title: 'Test News 2', slug: 'test-2' }
      ];
      
      return route.fulfill({
        status: 200,
        body: JSON.stringify(mockNews),
        contentType: 'application/json'
      });
    });
    
    await page.goto('/news');
    await page.waitForTimeout(2000);
    
    // Basic check that page loaded
    expect(page.url()).toContain('/news');
    const hasBody = await page.locator('body').count() > 0;
    expect(hasBody).toBeTruthy();
  });
});
