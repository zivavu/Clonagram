import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export const ACTIVE_STORIES_SELECT = `
   id, created_at, user_id,
   profiles!stories_user_id_fkey(username, avatar_url),
   story_images(url, blur_data_url),
   story_videos(mux_playback_id),
   story_views(viewer_id)
`;

export function activeStoriesQuery(supabase: SupabaseClient<Database>) {
   return supabase
      .from('stories')
      .select(ACTIVE_STORIES_SELECT)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: true });
}

export type ActiveStories = QueryData<ReturnType<typeof activeStoriesQuery>>;
export type ActiveStory = ActiveStories[number];
