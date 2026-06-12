'use server';
import 'server-only';

import { UserIdSchema, validate } from '@/src/lib/validation';
import { createServerClient } from '../../lib/supabase/server';
import { throwIfError } from '../../lib/unwrap';

export async function getUserNote(params: { userId: string }): Promise<string | null> {
   const { userId } = validate(UserIdSchema, params);
   const supabase = await createServerClient();
   const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('user_id', userId)
      .maybeSingle();
   throwIfError({ error }, 'Failed to fetch note');
   return data?.content ?? null;
}
