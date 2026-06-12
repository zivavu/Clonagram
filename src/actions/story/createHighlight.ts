'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { CreateHighlightSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function createHighlight(params: {
   title: string;
   storyIds: string[];
   coverUrl: string | null;
}) {
   const { title, storyIds, coverUrl } = validate(CreateHighlightSchema, params);
   const { supabase, user } = await getAuthUser();

   const { data: highlight, error: highlightError } = await supabase
      .from('story_highlights')
      .insert({ title, user_id: user.id, cover_url: coverUrl })
      .select('id')
      .single();

   throwIfError({ error: highlightError }, 'Failed to create highlight');
   if (!highlight) throw new Error('Failed to create highlight: no data returned');

   if (storyIds.length > 0) {
      const items = storyIds.map((storyId, index) => ({
         highlight_id: highlight.id,
         story_id: storyId,
         position: index,
      }));

      const { error: itemsError } = await supabase.from('story_highlight_items').insert(items);

      throwIfError({ error: itemsError }, 'Failed to add stories to highlight');
   }

   revalidatePath('/profile');
}
