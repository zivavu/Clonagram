'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../getAuthUser';

export async function createHighlight(title: string, storyIds: string[], coverUrl: string | null) {
   const { supabase, user } = await getAuthUser();

   const { data: highlight, error: highlightError } = await supabase
      .from('story_highlights')
      .insert({ title, user_id: user.id, cover_url: coverUrl })
      .select('id')
      .single();

   if (highlightError) throw new Error(`Failed to create highlight: ${highlightError.message}`);

   if (storyIds.length > 0) {
      const items = storyIds.map((storyId, index) => ({
         highlight_id: highlight.id,
         story_id: storyId,
         position: index,
      }));

      const { error: itemsError } = await supabase.from('story_highlight_items').insert(items);

      if (itemsError) throw new Error(`Failed to add stories to highlight: ${itemsError.message}`);
   }

   revalidatePath('/profile');
}
