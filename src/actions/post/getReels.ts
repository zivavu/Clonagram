'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { CursorNullableSchema, validate } from '@/src/lib/validation';
import { reelsQuery } from '@/src/queries/posts';
import { hideLikesForNonOwners } from '@/src/utils/posts';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { getOptionalUser } from '../getAuthUser';

export async function getReels(params: { cursor?: string | null }) {
   const { cursor } = validate(CursorNullableSchema, params);
   const { supabase, user } = await getOptionalUser();
   const hideAi = user ? await getHideAiContent(supabase) : false;

   const { data, error } = await reelsQuery(supabase, user?.id, cursor, hideAi);
   throwIfError({ error }, 'Failed to fetch reels');
   return hideLikesForNonOwners(data ?? [], user?.id);
}
