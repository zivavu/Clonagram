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

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const authPages = [
      '/login',
      '/emailsignup',
      '/auth/callback',
      '/auth/reset-callback',
      '/mux-webhook',
   ];

   if (!user && !authPages.some(page => request.nextUrl.pathname.startsWith(page))) {
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
