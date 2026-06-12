'use server';
import 'server-only';

import { createServerClient } from '@/src/lib/supabase/server';

export type UserHighlight = {
   id: string;
   title: string;
   coverUrl: string | null;
};

export async function getUserHighlights(userId: string): Promise<UserHighlight[]> {
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('story_highlights')
      .select('id, title, cover_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

   if (error) throw new Error(`Failed to fetch highlights: ${error.message}`);

   return (data ?? []).map(row => ({
      id: row.id,
      title: row.title,
      coverUrl: row.cover_url,
   }));
}
