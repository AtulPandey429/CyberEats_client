import { test, expect } from '@playwright/test';

test('home page shows restaurant cards from API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Top Rated/i })).toBeVisible();
  await expect(page.getByText(/ZENITH|BINARY|QUANTUM|NEBULOUS|TEST/i).first()).toBeVisible({
    timeout: 15000,
  });
});
