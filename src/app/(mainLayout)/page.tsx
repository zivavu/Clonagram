import { headers } from 'next/headers';
import HomePage from '@/src/pageComponents/Home';

export default async function Home() {
   const headersList = await headers();
   return <HomePage url={headersList.get('x-url') || null} />;
}
