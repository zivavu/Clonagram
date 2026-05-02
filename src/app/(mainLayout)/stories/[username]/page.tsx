import { notFound } from 'next/navigation';
import StoriesPage from '@/src/pageComponents/Stories';
import { STORIES } from '@/src/pageComponents/Stories/data';

export default async function Stories({ params }: { params: Promise<{ username: string }> }) {
   const { username } = await params;
   if (!STORIES.some(s => s.username === username)) notFound();

   return <StoriesPage username={username} storyId={null} />;
}
