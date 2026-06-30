import { expect, test } from '@playwright/test';

test('home feed loads after login', async ({ page }) => {
   await page.goto('/');
   await expect(page).toHaveURL('/');
   // Logo label text is hidden on mobile; the Home nav item is present on every viewport.
   await expect(page.getByRole('link', { name: 'Home' })).toBeVisible({ timeout: 10000 });
});
