import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

const TEST_CAPTION = `e2e-delete-test-${Date.now()}`;

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
      ctx.fillStyle = '#ef4444';
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
   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;
   await supabase
      .from('posts')
      .delete()
      .eq('user_id', user.id)
      .like('caption', 'e2e-delete-test-%');
});

test('delete a post from the home feed', async ({ page }) => {
   await page.goto('/');
   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Post' }).click();

   const imageBuffer = await createTestImageBuffer(page);
   await page.locator('input[type="file"]').setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
   });

   const createModal = page.getByRole('dialog');
   await expect(createModal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await createModal.getByRole('button', { name: 'Next', exact: true }).click();
   await expect(createModal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await createModal.getByRole('button', { name: 'Next', exact: true }).click();
   await expect(createModal.getByRole('button', { name: 'Share', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await createModal.locator('textarea').fill(TEST_CAPTION);
   await createModal.getByRole('button', { name: 'Share', exact: true }).click();
   await expect(createModal.getByText('Your post has been shared.')).toBeVisible({
      timeout: 30000,
   });
   await createModal.getByRole('button', { name: 'Done' }).click();

   // After Done, the home feed refreshes and shows the newly created post
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   // Scope to the specific post card containing our caption.
   // .last() gives the deepest div that contains both our caption AND an actions button,
   // which is the HomepagePost root — not an outer ancestor that holds all posts.
   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Open Actions Modal') })
      .filter({ hasText: TEST_CAPTION })
      .last();

   await expect(postCard.getByLabel('Open Actions Modal')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Open Actions Modal').click();

   // OwnerActionsModal opens standalone (not nested) — no focus trap conflict
   await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible({
      timeout: 5000,
   });
   await page.getByRole('button', { name: 'Delete', exact: true }).click();

   const deleteConfirmDialog = page.getByRole('dialog').filter({ hasText: 'Delete post?' });
   await expect(deleteConfirmDialog).toBeVisible({ timeout: 5000 });
   await deleteConfirmDialog.getByRole('button', { name: 'Delete', exact: true }).click();

   // Post removed from feed confirms deletion succeeded
   await expect(page.getByText(TEST_CAPTION)).not.toBeVisible({ timeout: 15000 });
});
