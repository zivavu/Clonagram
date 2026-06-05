import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export async function getMutualFollowerSubtitles(
   supabase: SupabaseClient<Database>,
   authUserId: string,
   suggestedUserIds: string[],
): Promise<Record<string, string>> {
   if (suggestedUserIds.length === 0) return {};

   const { data: authFollowing } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', authUserId);

   const authFollowingIds = authFollowing?.map(f => f.following_id) ?? [];

   if (authFollowingIds.length === 0) {
      return Object.fromEntries(suggestedUserIds.map(id => [id, 'Suggested for you']));
   }

   const { data: mutualRows } = await supabase
      .from('follows')
      .select('following_id, follower:profiles!follower_id(id, username)')
      .in('following_id', suggestedUserIds)
      .in('follower_id', authFollowingIds);

   const grouped: Record<string, string[]> = {};
   for (const row of mutualRows ?? []) {
      const follower = row.follower as { id: string; username: string } | null;
      if (!follower?.username) continue;
      if (!grouped[row.following_id]) grouped[row.following_id] = [];
      grouped[row.following_id].push(follower.username);
   }

   const result: Record<string, string> = {};
   for (const id of suggestedUserIds) {
      const mutuals = grouped[id] ?? [];
      if (mutuals.length === 0) {
         result[id] = 'Suggested for you';
      } else if (mutuals.length === 1) {
         result[id] = `Followed by ${mutuals[0]}`;
      } else {
         result[id] = `Followed by ${mutuals[0]} + ${mutuals.length - 1} more`;
      }
   }

   return result;
}
