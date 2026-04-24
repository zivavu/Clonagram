import HomePage from '@/src/pageComponents/Home';
import { headers } from 'next/headers';

export default async function Home() {
   const headersList = await headers();
   return <HomePage url={headersList.get('x-url') || null} />;
}
