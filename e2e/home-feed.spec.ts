import { expect, test } from '@playwright/test';

test('home feed loads after login', async ({ page }) => {
   await page.goto('/');
   await expect(page).toHaveURL('/');
   await expect(page.getByText('Clonagram')).toBeVisible();
});
