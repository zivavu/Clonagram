import { expect, test } from '@playwright/test';

test('follow and unfollow a user from their profile', async ({ page }) => {
   await page.goto('/profile/e2euser2');
   await expect(page.getByText('e2euser2')).toBeVisible();

   const followButton = page.getByRole('button', { name: 'Follow' });
   await expect(followButton).toBeVisible();
   await followButton.click();

   const followingButton = page.getByRole('button', { name: 'Following' });
   await expect(followingButton).toBeVisible();

   await followingButton.click();
   await expect(followButton).toBeVisible();
});
