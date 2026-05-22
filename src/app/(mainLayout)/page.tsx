import HomePage from '@/src/pageComponents/Home';

export default async function Home({
   searchParams,
}: {
   searchParams: Promise<{ variant?: 'following' | 'home' | undefined }>;
}) {
   const { variant } = await searchParams;
   return <HomePage variant={variant ?? null} />;
}
