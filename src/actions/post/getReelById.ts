'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { PostIdSchema, validate } from '@/src/lib/validation';
import { reelsQuery } from '@/src/queries/posts';
import { hideLikesForNonOwners } from '@/src/utils/posts';
import { getOptionalUser } from '../getAuthUser';

export async function getReelById(params: { postId: string }) {
   const { postId } = validate(PostIdSchema, params);
   const { supabase, user } = await getOptionalUser();

   const { data, error } = await reelsQuery(supabase, user?.id).eq('id', postId).single();
   throwIfError({ error }, 'Failed to fetch reel');
   if (!data) return null;
   return hideLikesForNonOwners([data], user?.id)[0];
}
