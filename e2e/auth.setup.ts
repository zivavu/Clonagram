import { test as setup } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

const TEST_USER_1 = {
   email: 'e2e-user-1@example.com',
   password: 'TestPassword123!',
   username: 'e2euser1',
};

const TEST_USER_2 = {
   email: 'e2e-user-2@example.com',
   password: 'TestPassword123!',
   username: 'e2euser2',
};

const authFile = 'playwright/.auth/user1.json';

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
      await supabase.auth.admin.updateUserById(found.id, { password: user.password });
      return found.id;
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
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

   if (!url || !serviceRoleKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
   }

   const supabase = createClient<Database>(url, serviceRoleKey);

   await ensureTestUser(supabase, TEST_USER_1);
   await ensureTestUser(supabase, TEST_USER_2);

   await page.goto('/login');
   await page.getByLabel('Email adress').fill(TEST_USER_1.email);
   await page.getByLabel('Password').fill(TEST_USER_1.password);
   await page.getByRole('button', { name: 'Log in', exact: true }).click();
   await page.waitForURL('/', { timeout: 10000 });
   await page.context().storageState({ path: authFile });
});
