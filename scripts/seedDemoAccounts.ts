import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { demoAccounts } from '@/src/lib/demoAccounts';
import loginCardPeople from '@/src/pageComponents/Login/loginCardPeople';
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

   const avatarPath = `${data.user.id}/demo-avatar.webp`;
   const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, readFileSync(`public${account.avatar}`), {
         contentType: 'image/webp',
         upsert: true,
      });
   if (uploadError) throw uploadError;

   const {
      data: { publicUrl },
   } = supabase.storage.from('avatars').getPublicUrl(avatarPath);
   const sourcePhoto = loginCardPeople.find(person => person.src === account.avatarSourcePhoto);

   const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      username: account.username,
      full_name: account.fullName,
      avatar_url: `${publicUrl}?v=${Date.now()}`,
      avatar_attribution: sourcePhoto
         ? {
              photographerName: sourcePhoto.photographerName,
              photographerUrl: sourcePhoto.photographerUrl,
              photoUrl: sourcePhoto.photoUrl,
           }
         : null,
   });
   if (profileError) throw profileError;

   process.stdout.write(`${existingUser ? 'Updated' : 'Created'} ${account.email}\n`);
}
