'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { CursorNullableSchema, validate } from '@/src/lib/validation';
import type { Reels } from '@/src/queries/posts';
import { reelsQuery } from '@/src/queries/posts';
import { hideLikesForNonOwners } from '@/src/utils/posts';
import { getOptionalUser } from '../getAuthUser';

export async function getReels(params: { cursor?: string | null }): Promise<Reels> {
   const { cursor } = validate(CursorNullableSchema, params);
   const { supabase, user } = await getOptionalUser();

   const { data, error } = await reelsQuery(supabase, user?.id, cursor);
   throwIfError({ error }, 'Failed to fetch reels');
   return hideLikesForNonOwners(data ?? [], user?.id);
}
