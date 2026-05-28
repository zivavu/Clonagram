'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';

export async function getUserProfileWithPosts(params: { username: string }) {
   const { username } = params;
   const supabase = await createServerClient();

   const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select(
         `id, username, full_name, bio, avatar_url, website,
         followers:follows!following_id(count),
         following:follows!follower_id(count)`,
      )
      .eq('username', username)
      .single();

   if (userProfileError || !userProfile)
      throw new Error(
         `Failed to fetch user profile: ${userProfileError?.message ?? 'unknown error'}`,
      );

   const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userProfile.id);

   if (postsError)
      throw new Error(`Failed to fetch posts: ${postsError?.message ?? 'unknown error'}`);

   return { userProfile, posts: postsData };
}

export type ProfileWithPosts = Awaited<ReturnType<typeof getUserProfileWithPosts>>;
