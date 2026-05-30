'use server';
import 'server-only';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { createServerClient } from '../../lib/supabase/server';
import { getFollowStatusServer } from '../../queries/followStatus';

export async function getUserProfileWithPosts(params: { username: string }) {
   const { username } = params;
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);

   const { data, error } = await supabase
      .from('profiles')
      .select(
         `id, username, full_name, bio, avatar_url, website, is_verified, is_private,
         followers:follows!following_id(count),
         following:follows!follower_id(count),
         posts!user_id(
            id, caption, created_at, aspect_ratio, hide_likes, like_count, comment_count,
            images:post_images(id, url, position, width, height),
            videos:post_videos(id, mux_playback_id, duration, position, width, height)
         )`,
      )
      .eq('username', username)
      .order('created_at', { referencedTable: 'posts', ascending: false })
      .single();

   if (error || !data)
      throw new Error(`Failed to fetch profile with posts: ${error?.message ?? 'unknown error'}`);

   const followStatus =
      authProfile && authProfile.id !== data.id
         ? await getFollowStatusServer(supabase, authProfile.id, data.id)
         : 'none';

   return { userProfile: data, posts: data.posts ?? [], followStatus };
}

export type ProfileWithPosts = Awaited<ReturnType<typeof getUserProfileWithPosts>>;
