'use server';
import 'server-only';

import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { PostIdSchema, validate } from '@/src/lib/validation';

export async function getHighlightStoryIds(params: { highlightId: string }): Promise<string[]> {
   validate(PostIdSchema, { postId: params.highlightId });
   const { highlightId } = params;
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('story_highlight_items')
      .select('story_id')
      .eq('highlight_id', highlightId)
      .order('position', { ascending: true });
   throwIfError({ error }, 'Failed to fetch highlight story ids');

   return (data ?? []).map(row => row.story_id);
}
