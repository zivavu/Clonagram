'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import {
   getBatchFollowStatuses as queryBatchFollowStatuses,
   getFollowStatus as queryFollowStatus,
} from '@/src/queries/followStatus';

export async function getFollowStatus(targetUserId: string) {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return 'none' as const;

   return queryFollowStatus(supabase, user.id, targetUserId);
}

export async function getBatchFollowStatuses(targetIds: string[]) {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user || targetIds.length === 0) return {};

   return queryBatchFollowStatuses(supabase, user.id, targetIds);
}
