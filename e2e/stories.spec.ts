import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

test.describe.configure({ mode: 'serial' });

function makeServiceClient() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
   return createClient<Database>(url, key);
}

async function createTestImageBuffer(page: import('@playwright/test').Page) {
   const base64 = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(0, 0, 500, 500);
      return new Promise<string>(resolve => {
         canvas.toBlob(blob => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob!);
         }, 'image/png');
      });
   });
   return Buffer.from(base64.split(',')[1], 'base64');
}

let createdStoryId: string | null = null;

test.afterAll(async () => {
   if (!createdStoryId) return;
   const supabase = makeServiceClient();
   await supabase.from('stories').delete().eq('id', createdStoryId);
});

test('create a story', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Story', exact: true }).click();

   await expect(page.getByText('Upload a photo or video for your story')).toBeVisible();

   const imageBuffer = await createTestImageBuffer(page);
   await page.locator('input[type="file"]').setInputFiles({
      name: 'test-story.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
   });

   const modal = page.getByRole('dialog');
   await expect(modal.getByRole('button', { name: 'Share' })).toBeVisible({ timeout: 10000 });
   await modal.getByRole('button', { name: 'Share' }).click();

   await expect(modal.getByText('Your story has been shared.')).toBeVisible({ timeout: 30000 });

   await modal.getByRole('button', { name: 'Done' }).click();
   await expect(modal).not.toBeVisible();

   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (user) {
      const { data } = await supabase
         .from('stories')
         .select('id')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false })
         .limit(1)
         .single();
      createdStoryId = data?.id ?? null;
   }
});

test('view own story in the story viewer', async ({ page }) => {
   await page.goto('/stories/e2euser1');

   await expect(page.getByText('e2euser1')).toBeVisible({ timeout: 10000 });
   await expect(page.locator('input[placeholder="Reply to e2euser1..."]')).toBeVisible();
});

test('like and unlike a story as another user', async ({ browser }) => {
   const ctx = await browser.newContext({ storageState: 'playwright/.auth/user2.json' });
   const page = await ctx.newPage();

   await page.goto('/stories/e2euser1');

   const replyInput = page.locator('input[placeholder="Reply to e2euser1..."]');
   await expect(replyInput).toBeVisible({ timeout: 10000 });

   const bottomBar = replyInput.locator('xpath=..');
   const likeButton = bottomBar.locator('button').first();

   await expect(likeButton.locator('svg[style*="color: red"]')).not.toBeVisible();
   await likeButton.click();
   await expect(likeButton.locator('svg[style*="color: red"]')).toBeVisible({ timeout: 5000 });

   await likeButton.click();
   await expect(likeButton.locator('svg[style*="color: red"]')).not.toBeVisible({ timeout: 5000 });

   await ctx.close();
});
