'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

interface FollowUser {
   id: string;
   username: string;
   full_name: string;
   avatar_url: string | null;
   is_private: boolean;
   is_verified: boolean;
}

export async function getFollowers(userId: string, page: number, pageSize = 10) {
   const supabase = await createServerClient();

   const from = page * pageSize;
   const to = from + pageSize - 1;

   const { data, error, count } = await supabase
      .from('follows')
      .select(
         `follower:profiles!follows_follower_id_fkey(
            id, username, full_name, avatar_url, is_private, is_verified
         )`,
         { count: 'exact', head: false },
      )
      .eq('following_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false });

   if (error) throw new Error(`Failed to fetch followers: ${error.message}`);

   const users = (data ?? []).map(row => row.follower).filter((u): u is FollowUser => u !== null);

   return { users, total: count ?? users.length };
}

export async function getFollowing(userId: string, page: number, pageSize = 10) {
   const supabase = await createServerClient();

   const from = page * pageSize;
   const to = from + pageSize - 1;

   const { data, error, count } = await supabase
      .from('follows')
      .select(
         `following:profiles!follows_following_id_fkey(
            id, username, full_name, avatar_url, is_private, is_verified
         )`,
         { count: 'exact', head: false },
      )
      .eq('follower_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false });

   if (error) throw new Error(`Failed to fetch following: ${error.message}`);

   const users = (data ?? []).map(row => row.following).filter((u): u is FollowUser => u !== null);

   return { users, total: count ?? users.length };
}
