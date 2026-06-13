'use server';
import 'server-only';
import { PROFILE_LIST_SELECT_BADGES } from '@/src/lib/profileSelect';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { GetFollowsSchema, validate } from '@/src/lib/validation';

export interface FollowUser {
   id: string;
   username: string;
   full_name: string;
   avatar_url: string | null;
   is_private: boolean;
   is_verified: boolean;
}

interface FollowListResult {
   users: FollowUser[];
   total: number;
}

async function getFollowList(
   direction: 'followers' | 'following',
   rawUserId: string,
   page: number,
   pageSize: number,
): Promise<FollowListResult> {
   const { userId } = validate(GetFollowsSchema, { userId: rawUserId });
   const supabase = await createServerClient();

   const from = page * pageSize;
   const to = from + pageSize - 1;

   if (direction === 'followers') {
      const { data, error, count } = await supabase
         .from('follows')
         .select(`follower:profiles!follows_follower_id_fkey(${PROFILE_LIST_SELECT_BADGES})`, {
            count: 'exact',
            head: false,
         })
         .eq('following_id', userId)
         .range(from, to)
         .order('created_at', { ascending: false });

      throwIfError({ error }, 'Failed to fetch followers');

      const users = (data ?? [])
         .map(row => row.follower)
         .filter((u): u is FollowUser => u !== null);
      return { users, total: count ?? users.length };
   }

   const { data, error, count } = await supabase
      .from('follows')
      .select(`following:profiles!follows_following_id_fkey(${PROFILE_LIST_SELECT_BADGES})`, {
         count: 'exact',
         head: false,
      })
      .eq('follower_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false });

   throwIfError({ error }, 'Failed to fetch following');

   const users = (data ?? []).map(row => row.following).filter((u): u is FollowUser => u !== null);
   return { users, total: count ?? users.length };
}

export async function getFollowers(userId: string, page: number, pageSize = 10) {
   return getFollowList('followers', userId, page, pageSize);
}

export async function getFollowing(userId: string, page: number, pageSize = 10) {
   return getFollowList('following', userId, page, pageSize);
}
