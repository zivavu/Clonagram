'use server';
import 'server-only';

import { createServerClient } from '../../lib/supabase/server';

export async function getUserNote(userId: string): Promise<string | null> {
   const supabase = await createServerClient();
   const { data } = await supabase
      .from('notes')
      .select('content')
      .eq('user_id', userId)
      .maybeSingle();
   return data?.content ?? null;
}
