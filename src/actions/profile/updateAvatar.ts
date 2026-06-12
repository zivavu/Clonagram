'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { createServerClient } from '../../lib/supabase/server';
import { throwIfError } from '../../lib/unwrap';

export async function updateAvatar({ avatarUrl }: { avatarUrl: string | null }) {
   const supabase = await createServerClient();
   const authProfile = await getAuthProfile(supabase);
   if (!authProfile) throw new Error('Not authenticated.');

   const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', authProfile.id);

   throwIfError({ error }, 'Failed to update avatar');
   revalidatePath('/', 'layout');
   revalidatePath('/[username]', 'page');
}
