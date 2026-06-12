'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { hideLikesForNonOwners, throwIfError } from '@/src/lib/unwrap';
import type { Reels } from '@/src/queries/posts';
import { REELS_PAGE_SIZE } from '@/src/queries/posts';

export async function getReels(cursor?: string | null): Promise<Reels> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   let query = supabase
      .from('posts')
      .select(
         `
            id, caption, created_at, aspect_ratio, hide_likes, comments_off,
            like_count, comment_count, location_name,
            likes(user_id),
            saves(user_id),
            user:profiles!user_id(id, username, avatar_url, is_verified),
            videos:post_videos(id, mux_playback_id, duration, position, width, height)
         `,
      )
      .eq('type', 'reel')
      .order('created_at', { ascending: false })
      .limit(REELS_PAGE_SIZE);

   if (user) {
      query = query.eq('likes.user_id', user.id).eq('saves.user_id', user.id);
   }
   if (cursor) query = query.lt('created_at', cursor);

   const { data, error } = await query;
   throwIfError({ error }, 'Failed to fetch reels');
   return hideLikesForNonOwners(data ?? [], user?.id);
}
