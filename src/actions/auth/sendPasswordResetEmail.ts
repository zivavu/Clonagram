'use server';
import 'server-only';
import { headers } from 'next/headers';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendPasswordResetEmail(email: string) {
   const supabase = await createServerClient();
   const headersList = await headers();
   const host = headersList.get('host') ?? 'localhost:3000';
   const protocol = host.includes('localhost') ? 'http' : 'https';
   const origin = `${protocol}://${host}`;

   const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-callback`,
   });

   if (error) throw new Error(error.message);
}
