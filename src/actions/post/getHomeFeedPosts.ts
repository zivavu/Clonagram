'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import type { PostsWithMedia } from '../../queries/posts';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';

export async function getHomeFeedPosts(variant: 'home' | 'following'): Promise<PostsWithMedia> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (variant === 'home') {
      const { data } = await supabase
         .from('posts')
         .select(POST_WITH_MEDIA_SELECT)
         .order('created_at', { ascending: false })
         .limit(10);
      return (data ?? []) as PostsWithMedia;
   }

   if (!user) {
      return [];
   }

   const { data: followedData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

   const followedIds = followedData?.map(f => f.following_id) ?? [];

   if (followedIds.length === 0) {
      return [];
   }

   const { data } = await supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .in('user_id', followedIds)
      .order('created_at', { ascending: false })
      .limit(10);

   return (data ?? []) as PostsWithMedia;
}
