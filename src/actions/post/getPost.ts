'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';

export async function getPostAction(postId: string) {
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('posts')
      .select(
         `
           id, caption, created_at, aspect_ratio, hide_likes, comments_off, location_name,
           likes(user_id),
           saves(user_id),
           comments(count),
           user:profiles!user_id(id, username, avatar_url, is_private),
           collaborators:post_collaborators(user:profiles!user_id(id, username, avatar_url)),
           images:post_images(id, url, position, width, height, blur_data_url, alt_text, tags:post_image_tags(id, x, y, user:profiles!user_id(id, username, avatar_url))),
           videos:post_videos(id, mux_playback_id, duration, position, width, height)
        `,
      )
      .eq('id', postId)
      .single();

   if (error || !data) throw new Error(`Failed to get post: ${error?.message ?? 'unknown error'}`);
   return data;
}
