'use server';
import 'server-only';
import { getCachedUser, getRequestClient } from '../lib/supabase/getCachedUser';

export async function getAuthUser() {
   const [supabase, user] = await Promise.all([getRequestClient(), getCachedUser()]);
   if (!user) throw new Error('Unauthorized');
   return { supabase, user };
}

export async function getOptionalUser() {
   const [supabase, user] = await Promise.all([getRequestClient(), getCachedUser()]);
   return { supabase, user };
}
