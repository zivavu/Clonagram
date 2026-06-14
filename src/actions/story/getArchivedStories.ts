'use server';
import 'server-only';

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

   const { data, error } = await supabase
      .from('stories')
      .select(
         `id, created_at,
         story_images(url, blur_data_url),
         story_videos(mux_playback_id)`,
      )
      .eq('user_id', user.id)
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: false });

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
