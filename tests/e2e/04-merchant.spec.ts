import { test, expect } from '@playwright/test';

test('merchant dashboard loads for merchant user', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Identity token').fill('merchant@test.com');
  await page.getByLabel('Access key').fill('Test@1234');
  await page.getByRole('button', { name: 'Initialize Session' }).click();
  await expect(page.getByText('Jordan')).toBeVisible({ timeout: 20000 });

  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: /merchant dashboard/i })).toBeVisible({
    timeout: 20000,
  });
});
