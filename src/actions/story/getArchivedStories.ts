'use server';
import 'server-only';

import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { throwIfError } from '@/src/lib/unwrap';
import { extractStoryMedia } from '@/src/queries/stories';
import { getAuthUser } from '../getAuthUser';

export type ArchivedStory = {
   id: string;
   createdAt: string;
   type: 'image' | 'video';
   url: string;
   blurDataUrl: string | null;
};

export async function getArchivedStories() {
   const { supabase, user } = await getAuthUser();
   const hideAi = await getHideAiContent(supabase);

   let query = supabase
      .from('stories')
      .select(
         `id, created_at,
          story_images(url, blur_data_url),
          story_videos(mux_playback_id)`,
      )
      .eq('user_id', user.id)
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: false });

   if (hideAi) query = query.eq('is_ai', false);

   const { data, error } = await query;

   throwIfError({ error }, 'Failed to fetch archived stories');

   const stories: ArchivedStory[] = [];
   for (const row of data ?? []) {
      const media = extractStoryMedia(row);
      if (!media) continue;
      stories.push({
         id: row.id,
         createdAt: row.created_at ?? '',
         type: media.type,
         url: media.url,
         blurDataUrl: media.blurDataUrl,
      });
   }
   return stories;
}
