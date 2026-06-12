'use server';
import 'server-only';
import type { PostLocation } from '@/src/components/CreatePostModal/types';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { throwIfError } from '@/src/lib/unwrap';
import { UpdatePostSchema, validate } from '../../lib/validation';
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
   const {
      postId: pid,
      caption: cap,
      location: loc,
      hideLikes: hl,
      commentsOff: co,
   } = validate(UpdatePostSchema, { postId, caption, location, hideLikes, commentsOff });
   const { supabase, user } = await getAuthUser();
   const authProfile = await getAuthProfile(supabase);

   if (!authProfile || authProfile.id !== user.id) throw new Error('Not authorized');

   const { error } = await supabase
      .from('posts')
      .update({
         caption: cap || null,
         location_name: loc?.name ?? null,
         location_lat: loc?.lat ?? null,
         location_lon: loc?.lon ?? null,
         hide_likes: hl,
         comments_off: co,
      })
      .eq('id', pid)
      .eq('user_id', authProfile.id);

   throwIfError({ error }, 'Failed to update post');
}
