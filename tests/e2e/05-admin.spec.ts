import { test, expect } from '@playwright/test';

test('admin terminal shows analytics dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Identity token').fill('admin@test.com');
  await page.getByLabel('Access key').fill('Test@1234');
  await page.getByRole('button', { name: 'Initialize Session' }).click();
  await expect(page.getByText('Sam')).toBeVisible({ timeout: 20000 });

  await page.goto('/terminal');
  await expect(page.getByRole('heading', { name: /admin terminal/i })).toBeVisible({
    timeout: 20000,
  });
  await expect(page.getByText('Revenue USD')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Date range filter' })).toBeVisible();
  await expect(page.getByText('7 days')).toBeVisible();
  await expect(page.getByText('Revenue', { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('User activity')).toBeVisible();
  await expect(page.getByText('Payment ledger')).toBeVisible();
});
