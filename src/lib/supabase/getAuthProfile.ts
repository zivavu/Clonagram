import { createServerClient } from './server';

export async function getAuthProfile() {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return null;
   const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', user.id)
      .single();
   return profile;
}
