import StoriesPage from '@/src/pageComponents/Stories';

export default async function Page({ params }: { params: { username: string } }) {
   const { username } = await params;
   return <StoriesPage username={username} />;
}
