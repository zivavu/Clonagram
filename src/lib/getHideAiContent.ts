import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export async function getHideAiContent(supabase: SupabaseClient<Database>) {
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return false;
   const { data } = await supabase
      .from('profiles')
      .select('hide_ai_content')
      .eq('id', user.id)
      .single();
   return data?.hide_ai_content ?? false;
}
