'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { UsernameParamSchema, validate } from '@/src/lib/validation';
import { throwIfError } from '../../lib/unwrap';
import { getFollowStatus } from '../../queries/followStatus';
import { hideLikesForNonOwners, scopePostEngagementToUser } from '../../utils/posts';
import { getAuthUser } from '../getAuthUser';

export async function getUserProfileWithPosts(params: { username: string }) {
   const { username } = validate(UsernameParamSchema, params);
   const { supabase, user } = await getAuthUser();
   const hideAi = await getHideAiContent(supabase);

   let query = supabase
      .from('profiles')
      .select(
         `id, username, full_name, bio, avatar_url, avatar_attribution, website, is_verified, is_private,
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
      .lte('posts.created_at', new Date().toISOString())
      .order('created_at', { referencedTable: 'posts', ascending: false });

   if (hideAi) query = query.eq('posts.is_ai', false);
   query = scopePostEngagementToUser(query, user.id, 'posts');

   const { data, error } = await query.single();

   throwIfError({ error }, 'Failed to fetch profile with posts');
   if (!data) throw new Error('Failed to fetch profile with posts: no data returned');

   const followStatus: 'following' | 'requested' | 'none' =
      user.id !== data.id ? await getFollowStatus(supabase, user.id, data.id) : 'none';

   const userProfile = { ...data };

   return {
      userProfile,
      posts: hideLikesForNonOwners(data.posts ?? [], user.id),
      followStatus,
   };
}

export type ProfileWithPosts = Awaited<ReturnType<typeof getUserProfileWithPosts>>;
