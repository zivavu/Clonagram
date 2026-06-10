'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';

export async function getPostAction(postId: string) {
   const supabase = await createServerClient();

   const { data, error } = await supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .eq('id', postId)
      .single();

   if (error || !data) throw new Error(`Failed to get post: ${error?.message ?? 'unknown error'}`);
   return data;
}
