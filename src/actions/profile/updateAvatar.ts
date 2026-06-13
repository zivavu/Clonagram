'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { UpdateAvatarSchema, validate } from '@/src/lib/validation';
import { throwIfError } from '../../lib/unwrap';
import { getAuthUser } from '../getAuthUser';

export async function updateAvatar(params: { avatarUrl: string | null }) {
   const { avatarUrl } = validate(UpdateAvatarSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

   throwIfError({ error }, 'Failed to update avatar');
   revalidatePath('/', 'layout');
   revalidatePath('/profile/[username]', 'page');
}
