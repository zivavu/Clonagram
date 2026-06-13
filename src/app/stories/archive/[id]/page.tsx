import { getArchivedStories } from '@/src/actions/story/getArchivedStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import StoriesPage from '@/src/pageComponents/Stories';

export default async function ArchiveStoryViewerRoute({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const [stories, profile] = await Promise.all([getArchivedStories(), getAuthProfile()]);

   const entries = stories.map(story => ({
      userId: profile?.id ?? '',
      slug: story.id,
      username: profile?.username ?? '',
      avatarUrl: profile?.avatar_url ?? '',
      timestamp: story.createdAt,
      stories: [
         {
            storyId: story.id,
            type: story.type,
            url: story.url,
            blurDataUrl: story.blurDataUrl,
            timestamp: story.createdAt,
         },
      ],
   }));

   return (
      <StoriesPage
         startSlug={id}
         basePath="/stories/archive"
         showReply={false}
         closeHref="/archive/stories"
         entries={entries}
         viewedStoryIds={stories.map(story => story.id)}
         reactedStoryIds={[]}
         currentUserId={profile?.id ?? null}
      />
   );
}
