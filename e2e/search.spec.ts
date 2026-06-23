import { expect, test } from '@playwright/test';

test('search for a user and navigate to their profile', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('button', { name: 'Search' }).click();
   await expect(page.getByPlaceholder('Search')).toBeVisible();

   await page.getByPlaceholder('Search').fill('e2euser2');

   await expect(page.getByRole('listbox').getByText('e2euser2')).toBeVisible({ timeout: 10000 });

   await page.getByRole('listbox').getByText('e2euser2').click();

   await expect(page).toHaveURL(/\/profile\/e2euser2/, { timeout: 10000 });
});
