'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { TargetUserIdSchema, validate } from '@/src/lib/validation';
import { getStoryRingState } from '@/src/queries/stories';
import { getOptionalUser } from '../getAuthUser';

export async function getRingState(params: { targetUserId: string }) {
   const { targetUserId } = validate(TargetUserIdSchema, params);
   const { supabase, user } = await getOptionalUser();
   const authUserId = user?.id ?? null;
   const hideAi = user ? await getHideAiContent(supabase) : false;

   return getStoryRingState(supabase, targetUserId, authUserId, hideAi);
}
