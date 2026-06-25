import { expect, test } from '@playwright/test';

test.describe('unauthenticated', () => {
   test.use({ storageState: { cookies: [], origins: [] } });

   test('forgot password flow shows reset form and returns to login', async ({ page }) => {
      await page.goto('/login');

      // Trigger the forgot-password view
      await page.getByRole('button', { name: 'Forgot password?' }).click();
      await expect(page.getByText('Reset your password')).toBeVisible({ timeout: 5000 });
      await expect(page.getByLabel('Email address')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Send reset link' })).toBeVisible();

      // Back button returns to the login form
      await page.getByRole('button', { name: 'Back to login' }).click();
      await expect(page.getByText('Log into Clonagram')).toBeVisible({ timeout: 5000 });
   });
});
