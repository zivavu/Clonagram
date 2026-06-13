'use server';
import 'server-only';
import { TargetUserIdSchema, validate } from '@/src/lib/validation';
import { getStoryRingState } from '@/src/queries/stories';
import { getOptionalUser } from '../getAuthUser';

export async function getRingState(params: {
   targetUserId: string;
}): Promise<{ hasStories: boolean; allStoriesViewed: boolean }> {
   const { targetUserId } = validate(TargetUserIdSchema, params);
   const { supabase, user } = await getOptionalUser();
   const authUserId = user?.id ?? null;

   return getStoryRingState(supabase, targetUserId, authUserId);
}
