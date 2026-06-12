'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import { hideLikesForNonOwners, throwIfError } from '../../lib/unwrap';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';

export async function getPost(postId: string) {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   const { data: postData, error } = await supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .eq('id', postId)
      .eq('likes.user_id', user?.id ?? '00000000-0000-0000-0000-000000000000')
      .eq('saves.user_id', user?.id ?? '00000000-0000-0000-0000-000000000000')
      .single();

   throwIfError({ error }, 'Failed to get post');
   if (!postData) throw new Error('Failed to get post: no data returned');
   return hideLikesForNonOwners([postData], user?.id)[0];
}
