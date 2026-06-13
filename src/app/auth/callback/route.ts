import { NextResponse } from 'next/server';
import { createServerClient } from '@/src/lib/supabase/server';

function getUserFriendlyError(message: string) {
   if (message.includes('PKCE') || message.includes('code verifier')) {
      return 'Authentication failed because the login was started in a different browser. Please try again in the same browser.';
   }
   return message;
}

export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get('code');
   let next = searchParams.get('next') ?? '/';
   if (!next.startsWith('/')) {
      next = '/';
   }
   if (code) {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
         return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(getUserFriendlyError(error.message))}`,
         );
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
