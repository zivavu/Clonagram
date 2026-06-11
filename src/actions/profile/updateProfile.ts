'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { UpdateProfileSchema, validate } from '../../lib/validation';
import { getAuthUser } from '../getAuthUser';

interface UpdateProfileParams {
   fullName: string;
   username: string;
   bio: string;
   website: string | null;
   gender: string | null;
}

export async function updateProfile(params: UpdateProfileParams) {
   const { fullName, username, bio, website, gender } = validate(UpdateProfileSchema, params);

   const { supabase, user } = await getAuthUser();
   const authProfile = await getAuthProfile(supabase);
   if (!authProfile || authProfile.id !== user.id) throw new Error('Not authorized.');

   const { data: taken } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', authProfile.id)
      .maybeSingle();

   if (taken) return { usernameError: 'That username is already taken.' };

   const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, username, bio, website, gender })
      .eq('id', authProfile.id);

   if (error) throw new Error(error.message);
   revalidatePath('/', 'layout');
   revalidatePath('/[username]', 'page');
   return {};
}
