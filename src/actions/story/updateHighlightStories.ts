'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../getAuthUser';

export async function updateHighlightStories(highlightId: string, storyIds: string[]) {
   const { supabase, user } = await getAuthUser();

   const { data: highlight } = await supabase
      .from('story_highlights')
      .select('id')
      .eq('id', highlightId)
      .eq('user_id', user.id)
      .single();

   if (!highlight) throw new Error('Highlight not found');

   await supabase.from('story_highlight_items').delete().eq('highlight_id', highlightId);

   if (storyIds.length > 0) {
      const items = storyIds.map((storyId, index) => ({
         highlight_id: highlightId,
         story_id: storyId,
         position: index,
      }));
      await supabase.from('story_highlight_items').insert(items);
   }

   revalidatePath('/profile');
}
