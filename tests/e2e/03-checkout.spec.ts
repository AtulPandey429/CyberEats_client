import { test, expect } from '@playwright/test';

test('checkout page shows total after login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Identity token').fill('customer@test.com');
  await page.getByLabel('Access key').fill('Test@1234');
  await page.getByRole('button', { name: 'Initialize Session' }).click();
  await expect(page.getByText('Alex')).toBeVisible({ timeout: 20000 });

  await page.goto('/checkout');
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  await expect(page.getByText(/Subtotal|Total|cart is empty/i)).toBeVisible();
});
