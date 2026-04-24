import HomePage from '@/src/pages/Home';
import { headers } from 'next/headers';

export default async function Home() {
   const headersList = await headers();
   console.log(headersList.get('x-url'));
   return <HomePage url={headersList.get('x-url') || null} />;
}
