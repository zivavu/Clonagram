import { getArchivedStories } from '@/src/actions/story/getArchivedStories';
import ArchivePage from '@/src/pageComponents/Archive';

export default async function ArchiveStoriesPage() {
   const stories = await getArchivedStories();
   return <ArchivePage stories={stories} />;
}
