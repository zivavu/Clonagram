'use server';
import 'server-only';

import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { UserIdSchema, validate } from '@/src/lib/validation';

export type UserHighlight = {
   id: string;
   title: string;
   coverUrl: string | null;
};

export async function getUserHighlights(params: { userId: string }) {
   const { userId } = validate(UserIdSchema, params);
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('story_highlights')
      .select('id, title, cover_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

   throwIfError({ error }, 'Failed to fetch highlights');

   return (data ?? []).map(row => ({
      id: row.id,
      title: row.title,
      coverUrl: row.cover_url,
   }));
}
