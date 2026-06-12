'use server';
import 'server-only';

import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';
import { createServerClient } from '@/src/lib/supabase/server';
import type { StoryEntry } from './getActiveStories';

function highlightEntriesQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('story_highlights')
      .select(
         `id, title, updated_at,
          story_highlight_items(
            position,
            stories!story_highlight_items_story_id_fkey(
              id,
              story_images(url, blur_data_url),
              story_videos(mux_playback_id)
            )
          )`,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
}

type HighlightEntriesData = QueryData<ReturnType<typeof highlightEntriesQuery>>;

export async function getHighlightEntries(username: string): Promise<{
   entries: StoryEntry[];
   profileUserId: string;
}> {
   const supabase = await createServerClient();

   const { data: profile } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .eq('username', username)
      .single();

   if (!profile) return { entries: [], profileUserId: '' };

   const { data: raw } = await highlightEntriesQuery(supabase, profile.id);

   const highlights: HighlightEntriesData = raw ?? [];

   const entries: StoryEntry[] = highlights
      .filter(h => h.story_highlight_items.length > 0)
      .map(highlight => {
         const sorted = [...highlight.story_highlight_items].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0),
         );

         const stories: StoryEntry['stories'] = [];
         for (const item of sorted) {
            const s = item.stories;
            if (!s) continue;
            const isImage = s.story_images.length > 0;
            const url = isImage
               ? s.story_images[0].url
               : (s.story_videos[0]?.mux_playback_id ?? '');
            if (!url) continue;
            stories.push({
               userId: s.id,
               type: isImage ? 'image' : 'video',
               url,
               blurDataUrl: isImage ? (s.story_images[0].blur_data_url ?? null) : null,
            });
         }

         return {
            userId: profile.id,
            slug: highlight.id,
            username: highlight.title,
            avatarUrl: profile.avatar_url ?? '',
            timestamp: highlight.updated_at ?? '',
            stories,
         };
      })
      .filter(e => e.stories.length > 0);

   return { entries, profileUserId: profile.id };
}
