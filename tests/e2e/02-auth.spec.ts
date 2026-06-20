import { test, expect } from '@playwright/test';

test('login and view profile', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Identity token').fill('customer@test.com');
  await page.getByLabel('Access key').fill('Test@1234');
  await page.getByRole('button', { name: 'Initialize Session' }).click();
  await expect(page.getByText('Alex')).toBeVisible({ timeout: 20000 });
});
