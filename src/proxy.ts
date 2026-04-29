import type { NextRequest } from 'next/server';
import { updateSession } from '@/src/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
   const response = await updateSession(request);
   response.headers.set('x-url', request.url);
   return response;
}

export const config = {
   matcher: [
      /*
       * Match all request paths except static files and Next.js internals.
       * The session must be refreshed on every navigation for SSR to work correctly.
       */
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
   ],
};
