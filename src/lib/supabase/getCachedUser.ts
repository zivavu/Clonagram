import 'server-only';

import { cache } from 'react';
import { createServerClient } from './server';

export const getRequestClient = cache(createServerClient);

export const getCachedUser = cache(async () => {
   const supabase = await getRequestClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   return user ?? null;
});
