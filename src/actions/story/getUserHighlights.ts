'use server';
import 'server-only';

import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { UserIdSchema, validate } from '@/src/lib/validation';

export type UserHighlight = {
   id: string;
   title: string;
   coverUrl: string | null;
};

export async function getUserHighlights(params: { userId: string }) {
   const { userId } = validate(UserIdSchema, params);
   const supabase = await createServerClient();
   const { data: authData } = await supabase.auth.getUser();
   const hideAi = authData.user ? await getHideAiContent(supabase) : false;

   let query = supabase
      .from('story_highlights')
      .select(
         `id, title, cover_url,
          story_highlight_items(
            position,
            stories!story_highlight_items_story_id_fkey(
              story_images(url)
            )
          )`,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

   if (hideAi) query = query.eq('is_ai', false);

   const { data, error } = await query;

   throwIfError({ error }, 'Failed to fetch highlights');

   return (data ?? []).map(row => {
      let coverUrl = row.cover_url ?? null;

      if (!coverUrl) {
         const sorted = [...row.story_highlight_items].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0),
         );
         for (const item of sorted) {
            const url = item.stories?.story_images?.[0]?.url;
            if (url) { coverUrl = url; break; }
         }
      }

      return { id: row.id, title: row.title, coverUrl };
   });
}
