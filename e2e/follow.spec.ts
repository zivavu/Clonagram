import { expect, test } from '@playwright/test';

test('follow and unfollow a user from their profile', async ({ page }) => {
   await page.goto('/profile/e2euser2');

   const followButton = page.getByRole('button', { name: 'Follow', exact: true });
   await expect(followButton).toBeVisible();
   await followButton.click();

   const followingButton = page.getByRole('button', { name: 'Following', exact: true });
   await expect(followingButton).toBeVisible();

   await followingButton.click();
   await expect(followButton).toBeVisible();
});
