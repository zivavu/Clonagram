import { type CookieMethodsServer, type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
   if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
   }

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

   const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
      cookies: cookieMethods,
   });

   // Refresh the session — do not add logic between createServerClient and
   // getUser(), as it may cause hard-to-debug session issues.
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (
      !user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/emailsignup')
   ) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
   }
   if (
      (user && request.nextUrl.pathname.startsWith('/login')) ||
      request.nextUrl.pathname.startsWith('/emailsignup')
   ) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
   }

   return supabaseResponse;
}
