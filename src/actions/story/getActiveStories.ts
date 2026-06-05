'use server';
import 'server-only';

import { getAuthUser } from '../getAuthUser';

export async function getActiveStories() {
   const { supabase, user } = await getAuthUser();
   const currentUserId = user.id;

   const { data, error } = await supabase
      .from('stories')
      .select(
         `id, created_at, user_id,
          profiles!stories_user_id_fkey(username, avatar_url),
          story_images(url, blur_data_url),
          story_videos(mux_playback_id),
          story_views(viewer_id)`,
      )
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: true });

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

   for (const row of data ?? []) {
      const profile = row.profiles as { username: string; avatar_url: string | null } | null;
      if (!profile) continue;

      const images = row.story_images as Array<{ url: string; blur_data_url: string | null }>;
      const videos = row.story_videos as Array<{ mux_playback_id: string | null }>;
      const views = row.story_views as Array<{ viewer_id: string }>;

      const isImage = images.length > 0;
      const mediaUrl = isImage ? images[0].url : (videos[0]?.mux_playback_id ?? '');
      const blurDataUrl = isImage ? (images[0].blur_data_url ?? null) : null;

      const isViewed = views.some(v => v.viewer_id === currentUserId);
      if (isViewed) viewedStoryIds.push(row.id);

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

   return { entries, viewedStoryIds };
}

export type StoryEntry = Awaited<ReturnType<typeof getActiveStories>>['entries'][number];
