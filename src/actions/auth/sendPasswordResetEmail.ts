'use server';
import 'server-only';
import { headers } from 'next/headers';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { SendPasswordResetSchema, validate } from '@/src/lib/validation';

export async function sendPasswordResetEmail(params: { email: string }) {
   const { email } = validate(SendPasswordResetSchema, params);
   const supabase = await createServerClient();
   const headersList = await headers();
   const host = headersList.get('host') ?? 'localhost:3000';
   const protocol = host.includes('localhost') ? 'http' : 'https';
   const origin = `${protocol}://${host}`;

   const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-callback`,
   });

   throwIfError({ error }, 'Failed to send password reset email');
}
