'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendPasswordResetEmail(email: string) {
   const supabase = await createServerClient();
   const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

   const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-callback`,
   });

   if (error) throw new Error(error.message);
}
