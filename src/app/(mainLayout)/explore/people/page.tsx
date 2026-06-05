import PeoplePage from '@/src/pageComponents/explore/PeoplePage';

export default async function People({
   searchParams,
}: {
   searchParams: Promise<{ tab?: string }>;
}) {
   const { tab } = await searchParams;
   return <PeoplePage tab={tab ?? null} />;
}
