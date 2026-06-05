'use server';
import 'server-only';

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
      .order('created_at', { ascending: false });

   if (error) throw new Error(`Failed to fetch archived stories: ${error.message}`);

   const stories: ArchivedStory[] = [];
   for (const row of data ?? []) {
      const images = row.story_images as Array<{ url: string; blur_data_url: string | null }>;
      const videos = row.story_videos as Array<{ mux_playback_id: string | null }>;
      const isImage = images.length > 0;
      const url = isImage ? images[0].url : (videos[0]?.mux_playback_id ?? '');
      if (!url) continue;
      stories.push({
         id: row.id,
         createdAt: row.created_at ?? '',
         type: isImage ? 'image' : 'video',
         url,
         blurDataUrl: isImage ? (images[0].blur_data_url ?? null) : null,
      });
   }
   return stories;
}
