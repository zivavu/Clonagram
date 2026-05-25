'use server';
import 'server-only';
import { createServerClient } from '../lib/supabase/server';

export async function getAuthUser() {
   const supabase = await createServerClient();
   const { data, error } = await supabase.auth.getUser();
   if (error || !data.user) throw new Error('Unauthorized');
   return { supabase, user: data.user };
}
