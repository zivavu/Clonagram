import { headers } from 'next/headers';

export async function isRequestsFolder(): Promise<boolean> {
   const headersList = await headers();
   const pathname = new URL(headersList.get('x-url') || '/').pathname;
   return pathname === '/direct/requests' || pathname.startsWith('/direct/requests/');
}
