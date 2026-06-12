'use server';
import 'server-only';

import { createServerClient } from '@/src/lib/supabase/server';

export async function getHighlightStoryIds(highlightId: string): Promise<string[]> {
   const supabase = await createServerClient();

   const { data } = await supabase
      .from('story_highlight_items')
      .select('story_id')
      .eq('highlight_id', highlightId)
      .order('position', { ascending: true });

   return (data ?? []).map(row => row.story_id);
}
