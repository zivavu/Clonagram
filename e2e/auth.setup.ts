import { expect, test as setup } from '@playwright/test';
import type { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';
import { makeServiceClient } from './helpers';

const TEST_USER_1 = {
   email: 'e2e-user-1@example.com',
   password: 'MySecureP@ssw0rd123!',
   username: 'e2euser1',
};

const TEST_USER_2 = {
   email: 'e2e-user-2@example.com',
   password: 'MySecureP@ssw0rd123!',
   username: 'e2euser2',
};

const user1AuthFile = 'playwright/.auth/user1.json';
const user2AuthFile = 'playwright/.auth/user2.json';

async function ensureTestUser(
   supabase: ReturnType<typeof createClient<Database>>,
   user: typeof TEST_USER_1,
) {
   const { data: existing } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
   });

   const found = existing.users.find(u => u.email === user.email);
   if (found) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(found.id);
      if (deleteError) throw deleteError;
   }

   const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { username: user.username, full_name: 'E2E User' },
   });

   if (error) throw error;
   if (!data.user) throw new Error('Failed to create test user');

   return data.user.id;
}

setup('authenticate', async ({ page }) => {
   const supabase = makeServiceClient();

   await ensureTestUser(supabase, TEST_USER_1);
   await ensureTestUser(supabase, TEST_USER_2);

   page.on('console', msg => {
      if (msg.type() === 'error') {
         console.error('Browser error:', msg.text());
      }
   });
   page.on('pageerror', err => console.error('Page error:', err.message));

   await page.goto('/login');
   await page.getByLabel('Email adress').fill(TEST_USER_1.email);
   await page.getByLabel('Password').fill(TEST_USER_1.password);

   const submitButton = page.getByRole('button', { name: 'Log in', exact: true });
   await expect(submitButton).toBeEnabled();
   await submitButton.click();

   await page.waitForURL('/', { timeout: 30000 });
   await page.context().storageState({ path: user1AuthFile });

   await page.context().clearCookies();
   await page.goto('/login');
   await page.getByLabel('Email adress').fill(TEST_USER_2.email);
   await page.getByLabel('Password').fill(TEST_USER_2.password);

   const submitButton2 = page.getByRole('button', { name: 'Log in', exact: true });
   await expect(submitButton2).toBeEnabled();
   await submitButton2.click();

   await page.waitForURL('/', { timeout: 30000 });
   await page.context().storageState({ path: user2AuthFile });
});
