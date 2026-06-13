'use server';
import 'server-only';

import { throwIfError } from '@/src/lib/unwrap';
import { activeStoriesQuery, extractStoryMedia } from '@/src/queries/stories';
import { getOptionalUser } from '../getAuthUser';

export async function getActiveStories() {
   const { supabase, user } = await getOptionalUser();
   const currentUserId = user?.id ?? null;

   const { data, error } = await activeStoriesQuery(supabase);

   throwIfError({ error }, 'Failed to fetch stories');

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

      const views = row.story_views;
      const reactions = row.story_reactions;

      const media = extractStoryMedia(row);
      if (!media) continue;

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
         type: media.type,
         url: media.url,
         blurDataUrl: media.blurDataUrl,
      });
   }

   const entries = Array.from(grouped.values()).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
   );

   return { entries, viewedStoryIds, reactedStoryIds };
}

export type StoryEntry = Awaited<ReturnType<typeof getActiveStories>>['entries'][number];
