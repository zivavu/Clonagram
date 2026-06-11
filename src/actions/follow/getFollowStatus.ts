'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import type { FollowState } from '@/src/queries/followStatus';

export async function getFollowStatus(targetUserId: string): Promise<FollowState> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return 'none';

   const [{ data: followData }, { data: requestData }] = await Promise.all([
      supabase
         .from('follows')
         .select('follower_id')
         .eq('follower_id', user.id)
         .eq('following_id', targetUserId)
         .maybeSingle(),
      supabase
         .from('follow_requests')
         .select('requester_id')
         .eq('requester_id', user.id)
         .eq('target_id', targetUserId)
         .maybeSingle(),
   ]);

   if (followData) return 'following';
   if (requestData) return 'requested';
   return 'none';
}

export async function getBatchFollowStatuses(
   targetIds: string[],
): Promise<Record<string, FollowState>> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user || targetIds.length === 0) return {};

   const [{ data: followData }, { data: requestData }] = await Promise.all([
      supabase
         .from('follows')
         .select('following_id')
         .eq('follower_id', user.id)
         .in('following_id', targetIds),
      supabase
         .from('follow_requests')
         .select('target_id')
         .eq('requester_id', user.id)
         .in('target_id', targetIds),
   ]);

   const result: Record<string, FollowState> = {};
   for (const id of targetIds) result[id] = 'none';
   for (const row of followData ?? []) result[row.following_id] = 'following';
   for (const row of requestData ?? []) result[row.target_id] = 'requested';
   return result;
}
