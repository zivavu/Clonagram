'use server';
import 'server-only';
import type { PostLocation } from '@/src/components/CreatePostModal/types';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

interface UpdatePostParams {
   postId: string;
   caption: string;
   location: PostLocation | null;
   hideLikes: boolean;
   commentsOff: boolean;
}

export async function updatePost({
   postId,
   caption,
   location,
   hideLikes,
   commentsOff,
}: UpdatePostParams): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);

   if (!authProfile) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('posts')
      .update({
         caption: caption || null,
         location_name: location?.name ?? null,
         location_lat: location?.lat ?? null,
         location_lon: location?.lon ?? null,
         hide_likes: hideLikes,
         comments_off: commentsOff,
      })
      .eq('id', postId)
      .eq('user_id', authProfile.id);

   if (error) throw error;
}
