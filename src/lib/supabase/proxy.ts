import { type CookieMethodsServer, type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest, requestHeaders: Headers) {
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
   }

   let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

   const cookieMethods: CookieMethodsServer = {
      getAll() {
         return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[], headers: Record<string, string>) {
         cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
         });
         supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
         cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
         });
         Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
         });
      },
   };

   const supabase = createServerClient(supabaseUrl, supabaseAnonKey, { cookies: cookieMethods });

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

   return supabaseResponse;
}
