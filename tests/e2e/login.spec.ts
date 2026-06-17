import { test, expect } from '@playwright/test';

test('login form shows validation errors', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Valid email required')).toBeVisible();
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
});
