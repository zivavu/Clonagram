import HomePage from '@/src/pageComponents/Home';

export default async function Home({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
   const { variant } = await searchParams;
   return <HomePage variant={variant ?? null} />;
}
