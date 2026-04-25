import StoriesPage from '@/src/pageComponents/Stories';

export default async function Page({ params }: { params: { username: string; id: string } }) {
   const { username, id } = await params;
   return <StoriesPage username={username} storyId={id} />;
}
