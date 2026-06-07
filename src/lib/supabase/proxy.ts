import { type CookieMethodsServer, type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseEnv } from './env';

export async function updateSession(request: NextRequest) {
   const { url, key } = getSupabaseEnv();
   const supabaseResponse = NextResponse.next({ request });

   const cookieMethods: CookieMethodsServer = {
      getAll() {
         return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
         cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
         });
         cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
         });
      },
   };

   const supabase = createServerClient(url, key, {
      cookies: cookieMethods,
   });

   // Validate the session — do not add logic between createServerClient and
   // getUser(), as it may cause hard-to-debug session issues.
   const {
      data: { user },
   } = await supabase.auth.getUser();

   const protectedPrefixes = ['/direct', '/accounts', '/dashboard', '/archive'];
   const isProtected = protectedPrefixes.some(prefix =>
      request.nextUrl.pathname.startsWith(prefix),
   );
   const isOwnProfile = request.nextUrl.pathname === '/profile';

   if ((!user || user.is_anonymous) && (isProtected || isOwnProfile)) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
   }
   if (
      user &&
      !user.is_anonymous &&
      (request.nextUrl.pathname.startsWith('/login') ||
         request.nextUrl.pathname.startsWith('/emailsignup'))
   ) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
   }

   return supabaseResponse;
}
