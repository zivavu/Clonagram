import { expect, test } from '@playwright/test';

const TEST_MESSAGE = `e2e-dm-${Date.now()}`;

test('send a direct message to another user', async ({ page }) => {
   await page.goto('/profile/e2euser2');

   // Message button appears on another user's profile
   await expect(page.getByRole('button', { name: 'Message', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await page.getByRole('button', { name: 'Message', exact: true }).click();

   // createConversation redirects to /direct/[id]
   await page.waitForURL(/\/direct\//, { timeout: 15000 });

   const messageInput = page.locator('[contenteditable]');
   await expect(messageInput).toBeVisible({ timeout: 10000 });
   await messageInput.click();
   await page.keyboard.type(TEST_MESSAGE);
   await page.keyboard.press('Enter');

   await expect(page.getByText(TEST_MESSAGE)).toBeVisible({ timeout: 10000 });
});
