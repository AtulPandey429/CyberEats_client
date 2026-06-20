import { test, expect } from '@playwright/test';

test('theme toggle switches light and dark mode', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');

  await expect(html).toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(html).toHaveClass(/light/);

  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(html).toHaveClass(/dark/);
});
