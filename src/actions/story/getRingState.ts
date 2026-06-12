'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { TargetUserIdSchema, validate } from '@/src/lib/validation';
import { getStoryRingState } from '@/src/queries/stories';

export async function getRingState(params: {
   targetUserId: string;
}): Promise<{ hasStories: boolean; allStoriesViewed: boolean }> {
   const { targetUserId } = validate(TargetUserIdSchema, params);
   const supabase = await createServerClient();
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();
   throwIfError({ error }, 'Failed to get auth user');
   const authUserId = user?.id ?? null;

   return getStoryRingState(supabase, targetUserId, authUserId);
}
