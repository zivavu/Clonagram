import { expect, test } from '@playwright/test';

test('edit profile name and bio', async ({ page }) => {
   await page.goto('/accounts/edit');
   await expect(page.getByRole('heading', { name: 'Edit profile' })).toBeVisible();

   const nameInput = page.getByPlaceholder('Name', { exact: true });
   await nameInput.fill('E2E Updated Name');

   const bioTextarea = page.getByPlaceholder('Bio');
   await bioTextarea.fill('E2E test bio text');

   await page.getByRole('button', { name: 'Submit' }).click();

   await expect(page.getByText('Profile saved.', { exact: true })).toBeVisible({ timeout: 10000 });

   await page.goto('/profile/e2euser1');
   await expect(page.getByText('E2E test bio text')).toBeVisible({ timeout: 10000 });
});
