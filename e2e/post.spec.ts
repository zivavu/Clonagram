import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

const TEST_CAPTION = `e2e-test-post-${Date.now()}`;

async function createTestImageBuffer(page: import('@playwright/test').Page) {
   const base64 = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#4f46e5';
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

test.afterAll(async () => {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
   const supabase = createClient<Database>(url, key);

   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;

   await supabase.from('posts').delete().eq('user_id', user.id).like('caption', 'e2e-test-post-%');
});

test('create a post and verify it appears on profile', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Post' }).click();

   await expect(page.getByText('Create new post')).toBeVisible();

   const imageBuffer = await createTestImageBuffer(page);
   await page.locator('input[type="file"]').setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
   });

   const modal = page.getByRole('dialog');
   await expect(modal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await modal.getByRole('button', { name: 'Next', exact: true }).click();

   await expect(modal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await modal.getByRole('button', { name: 'Next', exact: true }).click();

   await expect(modal.getByRole('button', { name: 'Share', exact: true })).toBeVisible({
      timeout: 10000,
   });

   await modal.locator('textarea').fill(TEST_CAPTION);

   await modal.getByRole('button', { name: 'Share', exact: true }).click();

   await expect(modal.getByText('Your post has been shared.')).toBeVisible({ timeout: 30000 });

   await modal.getByRole('button', { name: 'Done' }).click();

   await page.goto('/profile/e2euser1');
   await expect(page.getByText(TEST_CAPTION)).not.toBeVisible();
   const postImages = page.locator('img[alt]').first();
   await expect(postImages).toBeVisible({ timeout: 10000 });
});
