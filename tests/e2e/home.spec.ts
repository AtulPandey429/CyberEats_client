import { test, expect } from '@playwright/test';

test('home page loads with CyberEats branding', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'CYBEREATS' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Food delivery from the/i })).toBeVisible();
});

test('bottom navigation shows all items', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rewards' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
});
