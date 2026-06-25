import { expect, test } from '@playwright/test';

test.describe('unauthenticated', () => {
   test.use({ storageState: { cookies: [], origins: [] } });

   test('password reset flow sends email confirmation', async ({ page }) => {
      await page.goto('/login');

      await page.getByRole('button', { name: 'Forgot password?' }).click();

      await expect(page.getByText('Reset your password')).toBeVisible({ timeout: 5000 });

      await page.getByLabel('Email address').fill('e2e-user-1@example.com');
      await page.getByRole('button', { name: 'Send reset link' }).click();

      await expect(page.getByText('Check your email for a reset link.')).toBeVisible({
         timeout: 10000,
      });
   });
});
