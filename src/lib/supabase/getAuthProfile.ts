import { cache } from 'react';
import { createServerClient } from './server';

export const getAuthProfile = cache(async () => {
   const supabase = await createServerClient();
   const {
      data: { session },
   } = await supabase.auth.getSession();
   if (!session?.user) return null;
   const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', session.user.id)
      .single();
   return profile;
});
