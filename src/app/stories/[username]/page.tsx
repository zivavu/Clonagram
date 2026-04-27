import { STORIES } from '@/src/pageComponents/Stories/data';
import StoriesPage from '@/src/pageComponents/Stories';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { username: string } }) {
   const { username } = await params;
   if (!STORIES.some(s => s.username === username)) notFound();
   return <StoriesPage username={username} storyId={null} />;
}
