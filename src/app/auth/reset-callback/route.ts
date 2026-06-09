import { NextResponse } from 'next/server';
import { createServerClient } from '@/src/lib/supabase/server';

function getUserFriendlyError(message: string): string {
   if (message.includes('expired') || message.includes('OTP')) {
      return 'This reset link has expired. Please request a new one.';
   }
   if (message.includes('PKCE') || message.includes('code verifier')) {
      return 'This reset link must be opened in the same browser where you requested it. Please request a new reset link.';
   }
   return 'Something went wrong with this reset link. Please request a new one.';
}

export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get('code');

   if (code) {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
         return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(getUserFriendlyError(error.message))}`,
         );
      }
      return NextResponse.redirect(`${origin}/reset-password`);
   }

   return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('Invalid reset link. Please request a new one.')}`,
   );
}
