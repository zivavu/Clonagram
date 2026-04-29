import StoriesPage from '@/src/pageComponents/Stories';
import { STORIES } from '@/src/pageComponents/Stories/data';
import { notFound } from 'next/navigation';

export default async function Stories({ params }: { params: { username: string } }) {
   const { username } = await params;
   if (!STORIES.some(s => s.username === username)) notFound();

   return <StoriesPage username={username} storyId={null} />;
}
