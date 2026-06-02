'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { createServerClient } from '../../lib/supabase/server';

interface UpdateProfileParams {
   fullName: string;
   username: string;
   bio: string;
   website: string | null;
   gender: string | null;
}

export async function updateProfile(params: UpdateProfileParams) {
   const { fullName, username, bio, website, gender } = params;

   if (bio.length > 150) throw new Error('Bio must be 150 characters or less.');
   if (
      !username ||
      username.length > 30 ||
      !/^[a-zA-Z0-9_.]+$/.test(username) ||
      username.startsWith('.') ||
      username.endsWith('.') ||
      username.includes('..')
   ) {
      return {
         usernameError:
            'Username must be 1–30 characters: letters, numbers, underscores, dots only (no leading/trailing/consecutive dots).',
      };
   }

   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated.');

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
   return {};
}
