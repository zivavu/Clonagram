'use server';
import 'server-only';

import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { UsernameParamSchema, validate } from '@/src/lib/validation';
import { extractStoryMedia } from '@/src/queries/stories';
import type { Database } from '@/src/types/database';
import type { StoryEntry } from './getActiveStories';

function highlightEntriesQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('story_highlights')
      .select(
         `id, title, updated_at,
          story_highlight_items(
            position,
            stories!story_highlight_items_story_id_fkey(
              id, created_at,
              story_images(url, blur_data_url),
              story_videos(mux_playback_id)
            )
          )`,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
}

type HighlightEntriesData = QueryData<ReturnType<typeof highlightEntriesQuery>>;

export async function getHighlightEntries(params: { username: string }) {
   const { username } = validate(UsernameParamSchema, params);
   const supabase = await createServerClient();

   const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .eq('username', username)
      .single();
   throwIfError({ error: profileError }, 'Failed to fetch profile');

   if (!profile) return { entries: [], profileUserId: '' };

   const { data: raw, error: entriesError } = await highlightEntriesQuery(supabase, profile.id);
   throwIfError({ error: entriesError }, 'Failed to fetch highlight entries');

   const highlights: HighlightEntriesData = raw ?? [];

   const entries: StoryEntry[] = highlights
      .filter(h => h.story_highlight_items.length > 0)
      .map(highlight => {
         const sorted = [...highlight.story_highlight_items].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0),
         );

         const stories: StoryEntry['stories'] = [];
         const now = new Date().toISOString();
         for (const item of sorted) {
            const s = item.stories;
            if (!s) continue;
            if (s.created_at && s.created_at > now) continue;
            const media = extractStoryMedia(s);
            if (!media) continue;
            stories.push({
               storyId: s.id,
               type: media.type,
               url: media.url,
               blurDataUrl: media.blurDataUrl,
               timestamp: s.created_at ?? '',
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
