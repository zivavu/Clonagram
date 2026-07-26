import 'server-only';

import { cache } from 'react';
import { PROFILE_BASE_SELECT } from '@/src/lib/profileSelect';
import { getCachedUser, getRequestClient } from './getCachedUser';

export const getAuthProfile = cache(async () => {
   const [supabase, user] = await Promise.all([getRequestClient(), getCachedUser()]);
   if (!user) return null;
   const { data: profile } = await supabase
      .from('profiles')
      .select(PROFILE_BASE_SELECT)
      .eq('id', user.id)
      .single();
   return profile;
});

export type Profile = Awaited<ReturnType<typeof getAuthProfile>>;
