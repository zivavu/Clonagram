'use server';
import 'server-only';
import type { PostWithMedia } from '@/src/queries/posts';
import { createServerClient } from '../../lib/supabase/server';

export async function getPostAction(postId: string): Promise<PostWithMedia> {
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('posts')
      .select(
         `
         id, caption, created_at, aspect_ratio, hide_likes,
         likes(user_id),
         comments(count),
         user:profiles!user_id(id, username, avatar_url),
         images:post_images(id, url, position, width, height, blur_data_url),
         videos:post_videos(id, mux_playback_id, duration, position, width, height)
      `,
      )
      .eq('id', postId)
      .single();

   if (error || !data) throw new Error(`Failed to get post: ${error?.message ?? 'unknown error'}`);
   return data;
}
