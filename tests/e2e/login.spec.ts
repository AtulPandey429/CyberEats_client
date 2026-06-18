import { test, expect } from '@playwright/test';

test('login form shows validation errors', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Valid email required')).toBeVisible();
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
});

test('login page shows social login buttons', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Facebook' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Discord' })).toBeVisible();
  await expect(page.getByText('or continue with email')).toBeVisible();
});
