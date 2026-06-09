'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import type { PostLocation } from '@/src/components/CreatePostModal/types';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { getAuthUser } from '../getAuthUser';

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
}: UpdatePostParams) {
   const { supabase, user } = await getAuthUser();
   const authProfile = await getAuthProfile(supabase);

   if (!authProfile || authProfile.id !== user.id) throw new Error('Not authorized');

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
   revalidatePath('/');
   revalidatePath('/[username]', 'page');
   revalidatePath('/reels');
}
