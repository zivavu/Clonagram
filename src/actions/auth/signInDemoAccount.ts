'use server';
import 'server-only';
import { demoAccounts } from '@/src/lib/demoAccounts';
import { createServerClient } from '@/src/lib/supabase/server';
import { SignInDemoAccountSchema, validate } from '@/src/lib/validation';

export async function signInDemoAccount(params: { email: string }) {
   const { email } = validate(SignInDemoAccountSchema, params);
   const account = demoAccounts.find(demoAccount => demoAccount.email === email);
   const password = process.env.DEMO_ACCOUNTS_PASSWORD;

   if (!account) return { error: 'Unknown demo account.' };
   if (!password) return { error: 'Demo accounts are not configured.' };

   const supabase = await createServerClient();
   const { error } = await supabase.auth.signInWithPassword({ email: account.email, password });

   if (error) return { error: error.message };
   return {};
}
