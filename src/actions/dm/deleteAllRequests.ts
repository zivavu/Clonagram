'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function deleteAllRequests(): Promise<void> {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('user_id', user.id)
      .eq('folder', 'requests');
   throwIfError({ error }, 'Failed to delete all requests');
}
