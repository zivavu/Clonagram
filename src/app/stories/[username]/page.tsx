import { notFound } from 'next/navigation';
import { STORIES } from '@/src/mocks/stories';
import StoriesPage from '@/src/pageComponents/Stories';

export default async function Stories({ params }: { params: Promise<{ username: string }> }) {
   const { username } = await params;
   if (!STORIES.some(s => s.username === username)) notFound();

   return <StoriesPage username={username} storyId={null} />;
}
