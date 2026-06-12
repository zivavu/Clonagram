'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';

const EDIT_SELECT = `id, caption, hide_likes, comments_off, aspect_ratio,
   location_name, location_lat, location_lon,
   images:post_images(id, url, position),
   videos:post_videos(id, mux_playback_id, position)`;

export async function getPostForEdit(postId: string) {
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('posts')
      .select(EDIT_SELECT)
      .eq('id', postId)
      .single();

   throwIfError({ error }, 'Failed to fetch post');
   if (!data) throw new Error('Failed to fetch post: no data returned');

   return data;
}

export type PostForEdit = Awaited<ReturnType<typeof getPostForEdit>>;
