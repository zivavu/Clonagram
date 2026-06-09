import { NextResponse } from 'next/server';
import { createServerClient } from '@/src/lib/supabase/server';

export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get('code');

   if (code) {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
         return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
      return NextResponse.redirect(`${origin}/login?reset=true`);
   }

   return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
