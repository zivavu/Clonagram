'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { CursorNullableSchema, validate } from '@/src/lib/validation';
import type { Reels } from '@/src/queries/posts';
import { reelsQuery } from '@/src/queries/posts';
import { hideLikesForNonOwners } from '@/src/utils/posts';

export async function getReels(params: { cursor?: string | null }): Promise<Reels> {
   const { cursor } = validate(CursorNullableSchema, params);
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   const { data, error } = await reelsQuery(supabase, user?.id, cursor);
   throwIfError({ error }, 'Failed to fetch reels');
   return hideLikesForNonOwners(data ?? [], user?.id);
}
