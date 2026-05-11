import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';
export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get('code');
   let next = searchParams.get('next') ?? '/';
   if (!next.startsWith('/')) {
      next = '/';
   }
   if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
         return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
      const forwardedHost = request.headers.get('x-forwarded-host');
      const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
         return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
         return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
   }
   return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
