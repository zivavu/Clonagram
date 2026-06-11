'use server';
import 'server-only';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { hideLikesForNonOwners } from '../../lib/unwrap';
import { getFollowStatus } from '../../queries/followStatus';
import { getAuthUser } from '../getAuthUser';

type CountAggregate = [{ count: number }];

export async function getUserProfileWithPosts(params: { username: string }) {
   const { username } = params;
   const { supabase } = await getAuthUser();
   const authProfile = await getAuthProfile(supabase);

   let query = supabase
      .from('profiles')
      .select(
         `id, username, full_name, bio, avatar_url, website, is_verified, is_private,
          followers:follows!following_id(count),
          following:follows!follower_id(count),
          posts!user_id(
             id, caption, created_at, aspect_ratio, hide_likes, type,
             like_count, comment_count,
             likes(user_id),
             images:post_images(id, url, position, width, height),
             videos:post_videos(id, mux_playback_id, duration, position, width, height)
          )`,
      )
      .eq('username', username)
      .order('created_at', { referencedTable: 'posts', ascending: false });

   if (authProfile) {
      query = query.eq('posts.likes.user_id', authProfile.id);
   }

   const { data, error } = await query.single();

   if (error || !data)
      throw new Error(`Failed to fetch profile with posts: ${error?.message ?? 'unknown error'}`);

   const followStatus =
      authProfile && authProfile.id !== data.id
         ? await getFollowStatus(supabase, authProfile.id, data.id)
         : 'none';

   const userProfile = {
      ...data,
      followers: data.followers as unknown as CountAggregate,
      following: data.following as unknown as CountAggregate,
   };

   return {
      userProfile,
      posts: hideLikesForNonOwners(data.posts ?? [], authProfile?.id),
      followStatus,
   };
}

export type ProfileWithPosts = Awaited<ReturnType<typeof getUserProfileWithPosts>>;
