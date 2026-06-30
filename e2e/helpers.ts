import { expect, type Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

type ServiceClient = ReturnType<typeof createClient<Database>>;

export const USER_1_EMAIL = 'e2e-user-1@example.com';
export const USER_2_EMAIL = 'e2e-user-2@example.com';
export const USER_PASSWORD = 'MySecureP@ssw0rd123!';

export function makeServiceClient() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

   if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
   }

   return createClient<Database>(url, key);
}

export async function makeUserClient(email: string, password: string) {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

   if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
   }

   const client = createClient<Database>(url, key);
   const { error } = await client.auth.signInWithPassword({ email, password });
   if (error) throw error;
   return client;
}

export async function getUserId(supabase: ServiceClient, email: string) {
   const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   return data.users.find(u => u.email === email)?.id ?? null;
}

export async function deleteTestPostsByCaption(captionPrefix: string, email = USER_1_EMAIL) {
   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, email);
   if (!userId) return;
   await supabase.from('posts').delete().eq('user_id', userId).like('caption', `${captionPrefix}%`);
}

export async function getPostIdByCaption(supabase: ServiceClient, caption: string) {
   const { data } = await supabase.from('posts').select('id').eq('caption', caption).maybeSingle();
   return data?.id ?? null;
}

export async function createPostViaUI(page: Page, caption: string) {
   await page.goto('/');
   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Post', exact: true }).click();

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
   await modal.locator('textarea').fill(caption);
   await modal.getByRole('button', { name: 'Share', exact: true }).click();
   await expect(modal.getByText('Your post has been shared.')).toBeVisible({ timeout: 30000 });
   await modal.getByRole('button', { name: 'Done' }).click();
}

export async function createTestImageBuffer(page: Page, fillStyle = '#4f46e5') {
   const base64 = await page.evaluate(color => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get a 2d canvas context');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 500, 500);
      return new Promise<string>((resolve, reject) => {
         canvas.toBlob(blob => {
            if (!blob) {
               reject(new Error('Failed to create image blob'));
               return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
         }, 'image/png');
      });
   }, fillStyle);
   return Buffer.from(base64.split(',')[1], 'base64');
}
