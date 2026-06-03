import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export type FollowState = 'following' | 'requested' | 'none';

export async function getFollowStatus(
   supabase: SupabaseClient<Database>,
   authUserId: string,
   targetUserId: string,
): Promise<FollowState> {
   const [{ data: followData }, { data: requestData }] = await Promise.all([
      supabase
         .from('follows')
         .select('follower_id')
         .eq('follower_id', authUserId)
         .eq('following_id', targetUserId)
         .maybeSingle(),
      supabase
         .from('follow_requests')
         .select('requester_id')
         .eq('requester_id', authUserId)
         .eq('target_id', targetUserId)
         .maybeSingle(),
   ]);

   if (followData) return 'following';
   if (requestData) return 'requested';
   return 'none';
}

export async function getBatchFollowStatuses(
   supabase: SupabaseClient<Database>,
   authUserId: string,
   targetIds: string[],
): Promise<Record<string, FollowState>> {
   if (targetIds.length === 0) return {};

   const [{ data: followData }, { data: requestData }] = await Promise.all([
      supabase
         .from('follows')
         .select('following_id')
         .eq('follower_id', authUserId)
         .in('following_id', targetIds),
      supabase
         .from('follow_requests')
         .select('target_id')
         .eq('requester_id', authUserId)
         .in('target_id', targetIds),
   ]);

   const result: Record<string, FollowState> = {};
   for (const id of targetIds) result[id] = 'none';
   for (const row of followData ?? []) result[row.following_id] = 'following';
   for (const row of requestData ?? []) result[row.target_id] = 'requested';
   return result;
}
