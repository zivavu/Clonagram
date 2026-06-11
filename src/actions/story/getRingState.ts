'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { getStoryRingState } from '@/src/queries/stories';

export async function getRingState(
   targetUserId: string,
): Promise<{ hasStories: boolean; allStoriesViewed: boolean }> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   const authUserId = user?.id ?? null;

   return getStoryRingState(supabase, targetUserId, authUserId);
}
