import { expect, test } from '@playwright/test';
import { getUserId, makeServiceClient, USER_2_EMAIL } from './helpers';

const TEST_MESSAGE = `e2e-dm-${Date.now()}`;
const REALTIME_MESSAGE = `e2e-dm-realtime-${Date.now()}`;

test.afterAll(async () => {
   const supabase = makeServiceClient();
   await supabase.from('messages').delete().in('content', [TEST_MESSAGE, REALTIME_MESSAGE]);
});

async function openConversationWithUser2(page: import('@playwright/test').Page) {
   await page.goto('/profile/e2euser2');

   // Message button appears on another user's profile
   await expect(page.getByRole('button', { name: 'Message', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await page.getByRole('button', { name: 'Message', exact: true }).click();

   // createConversation redirects to /direct/[id]
   await page.waitForURL(/\/direct\//, { timeout: 15000 });

   const conversationId = new URL(page.url()).pathname.split('/').filter(Boolean).pop();
   if (!conversationId) throw new Error('Could not resolve conversation id from URL');
   return conversationId;
}

test('send a direct message to another user', async ({ page }) => {
   await openConversationWithUser2(page);

   const messageInput = page.locator('[contenteditable]');
   await expect(messageInput).toBeVisible({ timeout: 10000 });
   await messageInput.click();
   await page.keyboard.type(TEST_MESSAGE);
   await page.keyboard.press('Enter');

   await expect(page.getByText(TEST_MESSAGE)).toBeVisible({ timeout: 10000 });
});

test('receives another user message in real time', async ({ page }) => {
   const conversationId = await openConversationWithUser2(page);

   const supabase = makeServiceClient();
   const user2Id = await getUserId(supabase, USER_2_EMAIL);
   expect(user2Id).not.toBeNull();

   await expect(page.locator('[contenteditable]')).toBeVisible({ timeout: 10000 });
   await expect(page.getByText(REALTIME_MESSAGE)).not.toBeVisible();

   // Insert a message as user2 directly; the open chat must update via realtime, no reload
   const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user2Id as string,
      content: REALTIME_MESSAGE,
   });
   expect(error).toBeNull();

   await expect(page.getByText(REALTIME_MESSAGE)).toBeVisible({ timeout: 15000 });
});
