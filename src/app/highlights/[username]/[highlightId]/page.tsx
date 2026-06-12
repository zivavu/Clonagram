import { notFound } from 'next/navigation';
import { getHighlightEntries } from '@/src/actions/story/getHighlightEntries';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import StoriesPage from '@/src/pageComponents/Stories';

interface HighlightViewerPageProps {
   params: Promise<{
      username: string;
      highlightId: string;
   }>;
}

export default async function HighlightViewerPage({ params }: HighlightViewerPageProps) {
   const { username, highlightId } = await params;
   const [{ entries, profileUserId }, authProfile] = await Promise.all([
      getHighlightEntries({ username }),
      getAuthProfile(),
   ]);

   if (entries.length === 0) notFound();

   const startSlug = entries.some(e => e.slug === highlightId) ? highlightId : entries[0].slug;
   const isOwner = !!authProfile && authProfile.id === profileUserId;

   return (
      <StoriesPage
         startSlug={startSlug}
         basePath={`/highlights/${username}`}
         showReply={false}
         closeHref={`/profile/${username}`}
         showHighlightActions={isOwner}
         entries={entries}
         viewedStoryIds={[]}
         reactedStoryIds={[]}
         currentUserId={authProfile?.id ?? null}
      />
   );
}
