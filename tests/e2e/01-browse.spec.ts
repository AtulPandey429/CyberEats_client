import { test, expect } from '@playwright/test';

test('browse home to restaurant menu', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('CYBEREATS')).toBeVisible();
  await page.goto('/restaurants/zenith-sushi');
  await expect(page.getByRole('heading', { name: 'Menu' })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('button', { name: 'Add' }).first()).toBeVisible({ timeout: 20000 });
});
