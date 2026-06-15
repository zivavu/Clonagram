import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export const ACTIVE_STORIES_SELECT = `
   id, created_at, user_id,
   profiles!stories_user_id_fkey(username, avatar_url),
   story_images(url, blur_data_url),
   story_videos(mux_playback_id),
   story_views(viewer_id),
   story_reactions(user_id)
`;

function getOneMonthAgoISO() {
   const date = new Date();
   date.setMonth(date.getMonth() - 1);
   return date.toISOString();
}

export function activeStoriesQuery(supabase: SupabaseClient<Database>) {
   const now = new Date().toISOString();
   const oneMonthAgo = getOneMonthAgoISO();
   return supabase
      .from('stories')
      .select(ACTIVE_STORIES_SELECT)
      .gt('expires_at', now)
      .lte('created_at', now)
      .gte('created_at', oneMonthAgo)
      .order('created_at', { ascending: true });
}

export type ActiveStories = QueryData<ReturnType<typeof activeStoriesQuery>>;
export type ActiveStory = ActiveStories[number];

interface StoryMediaRow {
   story_images: { url: string; blur_data_url: string | null }[];
   story_videos: { mux_playback_id: string | null }[];
}

export function extractStoryMedia(row: StoryMediaRow) {
   if (row.story_images.length > 0) {
      return {
         type: 'image' as const,
         url: row.story_images[0].url,
         blurDataUrl: row.story_images[0].blur_data_url ?? null,
      };
   }
   if (row.story_videos.length > 0 && row.story_videos[0].mux_playback_id) {
      return {
         type: 'video' as const,
         url: row.story_videos[0].mux_playback_id,
         blurDataUrl: null,
      };
   }
   return null;
}

export async function getStoryRingState(
   supabase: SupabaseClient<Database>,
   userId: string,
   authUserId: string | null,
) {
   const now = new Date().toISOString();
   const oneMonthAgo = getOneMonthAgoISO();
   const { data: stories } = await supabase
      .from('stories')
      .select('id, story_views(viewer_id)')
      .eq('user_id', userId)
      .gt('expires_at', now)
      .lte('created_at', now)
      .gte('created_at', oneMonthAgo);

   if (!stories || stories.length === 0) {
      return { hasStories: false, allStoriesViewed: false };
   }

   return {
      hasStories: true,
      allStoriesViewed:
         authUserId !== null &&
         stories.every(story => story.story_views?.some(view => view.viewer_id === authUserId)),
   };
}
