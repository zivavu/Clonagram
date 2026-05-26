'use server';
import 'server-only';
import { getAuthUser } from '../getAuthUser';

export async function deleteAccountAction(): Promise<void> {
   const { supabase } = await getAuthUser();
   const { error } = await supabase.rpc('delete_user');
   if (error) throw new Error(`Failed to delete account: ${error.message}`);
}
