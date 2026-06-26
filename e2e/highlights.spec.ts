import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

test.describe.configure({ mode: 'serial' });

const HIGHLIGHT_NAME = `e2e-highlight-${Date.now()}`;
const RENAMED_NAME = `${HIGHLIGHT_NAME}-r`;

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
      ctx.fillStyle = '#059669';
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

test.beforeAll(async ({ browser }) => {
   const ctx = await browser.newContext({ storageState: 'playwright/.auth/user1.json' });
   const page = await ctx.newPage();
   await page.goto('/');

   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Story', exact: true }).click();

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

   await ctx.close();
});

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;
   await supabase.from('story_highlights').delete().eq('user_id', user.id);
   await supabase.from('stories').delete().eq('user_id', user.id);
});

test('create a highlight', async ({ page }) => {
   await page.goto('/profile/e2euser1');

   await page.getByText('New', { exact: true }).locator('xpath=../button').click();

   const dialog = page.getByRole('dialog');
   await expect(dialog.getByText('New Highlight')).toBeVisible();

   await dialog.locator('input').fill(HIGHLIGHT_NAME);
   await dialog.getByRole('button', { name: 'Next' }).click();

   await expect(dialog.locator('button:has(img)').first()).toBeVisible({ timeout: 15000 });
   await dialog.locator('button:has(img)').first().click();
   await dialog.getByRole('button', { name: 'Next' }).click();

   await expect(dialog.getByText('Choose Cover Photo')).toBeVisible();
   await dialog.getByRole('button', { name: 'Add' }).click();

   await expect(page.getByText(HIGHLIGHT_NAME)).toBeVisible({ timeout: 15000 });
});

test('rename a highlight', async ({ page }) => {
   await page.goto('/profile/e2euser1');

   await page.getByAltText(HIGHLIGHT_NAME).click();

   const dotsButton = page
      .locator('a[href="/profile/e2euser1"]')
      .locator('xpath=preceding-sibling::button[1]');
   await expect(dotsButton).toBeVisible({ timeout: 10000 });
   await dotsButton.click();

   const dialog = page.getByRole('dialog');
   await expect(dialog.getByRole('button', { name: 'Rename' })).toBeVisible({ timeout: 5000 });
   await dialog.getByRole('button', { name: 'Rename' }).click();

   await dialog.locator('input').fill(RENAMED_NAME);
   await dialog.getByRole('button', { name: 'Save' }).click();

   await page.goto('/profile/e2euser1');
   await expect(page.getByText(RENAMED_NAME)).toBeVisible({ timeout: 10000 });
   await expect(page.getByText(HIGHLIGHT_NAME, { exact: true })).not.toBeVisible();
});

test('delete a highlight', async ({ page }) => {
   await page.goto('/profile/e2euser1');

   await page.getByAltText(RENAMED_NAME).click();

   const dotsButton = page
      .locator('a[href="/profile/e2euser1"]')
      .locator('xpath=preceding-sibling::button[1]');
   await expect(dotsButton).toBeVisible({ timeout: 10000 });
   await dotsButton.click();

   const dialog = page.getByRole('dialog');
   await dialog.getByRole('button', { name: 'Delete' }).click();
   await dialog.getByRole('button', { name: 'Delete' }).click();

   await expect(page).toHaveURL('/profile/e2euser1', { timeout: 10000 });
   await expect(page.getByText(RENAMED_NAME)).not.toBeVisible();
});
