import { notFound } from 'next/navigation';
import { STORIES } from '@/src/mocks/stories';
import StoriesPage from '@/src/pageComponents/Stories';

export default async function Stories({ params }: { params: { username: string; id: string } }) {
   const { username, id } = await params;
   if (!STORIES.some(s => s.username === username)) notFound();

   return <StoriesPage username={username} storyId={id} />;
}
