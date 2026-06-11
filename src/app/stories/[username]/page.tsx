import StoriesPage from '@/src/pageComponents/Stories';
import { loadStoriesPage } from '../loadStoriesPage';

export default async function StoriesRoute({ params }: { params: Promise<{ username: string }> }) {
   const { username } = await params;
   const { entries, viewedStoryIds, reactedStoryIds, currentUserId } = await loadStoriesPage();

   return (
      <StoriesPage
         startSlug={username}
         basePath="/stories"
         entries={entries}
         viewedStoryIds={viewedStoryIds}
         reactedStoryIds={reactedStoryIds}
         currentUserId={currentUserId}
      />
   );
}
