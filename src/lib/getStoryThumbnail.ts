import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';
import { getMuxThumbnailUrl } from '@/src/utils/mux';

export async function getStoryThumbnail(supabase: SupabaseClient<Database>, storyId: string) {
   const { data: storyImage } = await supabase
      .from('story_images')
      .select('url')
      .eq('story_id', storyId)
      .order('position', { ascending: true })
      .limit(1)
      .maybeSingle();

   if (storyImage?.url) return storyImage.url;

   const { data: storyVideo } = await supabase
      .from('story_videos')
      .select('mux_playback_id')
      .eq('story_id', storyId)
      .order('position', { ascending: true })
      .limit(1)
      .maybeSingle();

   if (storyVideo?.mux_playback_id) {
      return getMuxThumbnailUrl(storyVideo.mux_playback_id);
   }

   return null;
}
