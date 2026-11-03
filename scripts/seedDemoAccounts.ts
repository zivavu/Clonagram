import { createClient } from '@supabase/supabase-js';
import { demoAccounts } from '@/src/lib/demoAccounts';
import type { Database } from '@/src/types/database';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.DEMO_ACCOUNTS_PASSWORD;

if (!url || !serviceRoleKey || !password) {
   throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or DEMO_ACCOUNTS_PASSWORD',
   );
}

const supabase = createClient<Database>(url, serviceRoleKey, {
   auth: { autoRefreshToken: false, persistSession: false },
});

const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({
   perPage: 1000,
});
if (listError) throw listError;

for (const account of demoAccounts) {
   const existingUser = usersPage.users.find(user => user.email === account.email);
   const metadata = { full_name: account.fullName, username: account.username };

   const { data, error } = existingUser
      ? await supabase.auth.admin.updateUserById(existingUser.id, {
           password,
           email_confirm: true,
           user_metadata: metadata,
        })
      : await supabase.auth.admin.createUser({
           email: account.email,
           password,
           email_confirm: true,
           user_metadata: metadata,
        });
   if (error) throw error;

   const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      username: account.username,
      full_name: account.fullName,
   });
   if (profileError) throw profileError;

   process.stdout.write(`${existingUser ? 'Updated' : 'Created'} ${account.email}\n`);
}
