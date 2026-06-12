'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { UpdateAvatarSchema, validate } from '@/src/lib/validation';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { createServerClient } from '../../lib/supabase/server';
import { throwIfError } from '../../lib/unwrap';

export async function updateAvatar(params: { avatarUrl: string | null }) {
   const { avatarUrl } = validate(UpdateAvatarSchema, params);
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
