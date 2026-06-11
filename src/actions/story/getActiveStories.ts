'use server';
import 'server-only';

import { createServerClient } from '../../lib/supabase/server';
import { activeStoriesQuery } from '../../queries/stories';

export async function getActiveStories() {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   const currentUserId = user?.id ?? null;

   const { data, error } = await activeStoriesQuery(supabase);

   if (error) throw new Error(`Failed to fetch stories: ${error.message}`);

   const grouped = new Map<
      string,
      {
         userId: string;
         slug: string;
         username: string;
         avatarUrl: string;
         timestamp: string;
         stories: Array<{
            userId: string;
            type: 'image' | 'video';
            url: string;
            blurDataUrl: string | null;
         }>;
      }
   >();

   const viewedStoryIds: string[] = [];
   const reactedStoryIds: string[] = [];

   for (const row of data ?? []) {
      const profile = row.profiles;
      if (!profile) continue;

      const images = row.story_images;
      const videos = row.story_videos;
      const views = row.story_views;
      const reactions = row.story_reactions;

      const isImage = images.length > 0;
      const mediaUrl = isImage ? images[0].url : (videos[0]?.mux_playback_id ?? '');
      const blurDataUrl = isImage ? (images[0].blur_data_url ?? null) : null;

      const isViewed = currentUserId !== null && views.some(v => v.viewer_id === currentUserId);
      if (isViewed) viewedStoryIds.push(row.id);

      const isReacted = currentUserId !== null && reactions.some(r => r.user_id === currentUserId);
      if (isReacted) reactedStoryIds.push(row.id);

      if (!grouped.has(row.user_id)) {
         grouped.set(row.user_id, {
            userId: row.user_id,
            slug: profile.username,
            username: profile.username,
            avatarUrl: profile.avatar_url ?? '',
            timestamp: row.created_at ?? '',
            stories: [],
         });
      }

      const entry = grouped.get(row.user_id);
      if (!entry) continue;
      if (row.created_at && row.created_at > entry.timestamp) {
         entry.timestamp = row.created_at;
      }
      entry.stories.push({
         userId: row.id,
         type: isImage ? 'image' : 'video',
         url: mediaUrl,
         blurDataUrl,
      });
   }

   const entries = Array.from(grouped.values()).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
   );

   return { entries, viewedStoryIds, reactedStoryIds };
}

export type StoryEntry = Awaited<ReturnType<typeof getActiveStories>>['entries'][number];
