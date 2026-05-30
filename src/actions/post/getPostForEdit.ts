'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function getPostForEdit(postId: string) {
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('posts')
      .select(
         `id, caption, hide_likes, comments_off, aspect_ratio,
         location_name, location_lat, location_lon,
         images:post_images(id, url, position),
         videos:post_videos(id, mux_playback_id, position)`,
      )
      .eq('id', postId)
      .single();

   if (error || !data)
      throw new Error(`Failed to fetch post: ${error?.message ?? 'unknown error'}`);

   return data;
}

export type PostForEdit = Awaited<ReturnType<typeof getPostForEdit>>;
