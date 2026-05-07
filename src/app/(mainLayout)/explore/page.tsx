import ExplorePage from '@/src/pageComponents/explore';

export default async function Explore({ searchParams }: { searchParams: Promise<{ variant?: string }> }) {
   const { variant } = await searchParams;
   return <ExplorePage variant={variant ?? null} />;
}
