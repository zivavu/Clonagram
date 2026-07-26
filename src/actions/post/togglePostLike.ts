'use server';
import 'server-only';
import { TogglePostLikeSchema, validate } from '@/src/lib/validation';
import { togglePostRelation } from './togglePostRelation';

export async function togglePostLike(params: { postId: string; isLiked: boolean }) {
   const { postId, isLiked } = validate(TogglePostLikeSchema, params);

   await togglePostRelation({
      table: 'likes',
      postId,
      isActive: isLiked,
      removeErrorMessage: 'Failed to unlike post',
      addErrorMessage: 'Failed to like post',
   });
}
