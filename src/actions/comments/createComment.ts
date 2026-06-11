'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import type { PostComment } from '@/src/queries/comments';
import { CreateCommentSchema, validate } from '../../lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function createComment(params: {
   postId: string;
   content: string;
   parentId?: string;
}): Promise<PostComment> {
   const { postId, content, parentId } = validate(CreateCommentSchema, params);
   const { supabase, user } = await getAuthUser();

   const { data: post } = await supabase
      .from('posts')
      .select('comments_off')
      .eq('id', postId)
      .single();

   if (post?.comments_off) {
      throw new Error('Comments are disabled on this post');
   }

   const { data, error } = await supabase
      .from('comments')
      .insert({
         post_id: postId,
         user_id: user.id,
         content,
         parent_id: parentId ?? null,
      })
      .select(
         'id, content, created_at, like_count, reply_count, parent_id, user:profiles!user_id(id, username, avatar_url), comment_likes(user_id)',
      )
      .single();

   if (error || !data)
      throw new Error(`Failed to post comment: ${error?.message ?? 'unknown error'}`);
   revalidatePath('/');
   revalidatePath('/reels');
   revalidatePath('/explore');
   revalidatePath('/profile/[username]', 'page');
   return data;
}
