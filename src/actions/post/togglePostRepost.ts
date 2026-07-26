'use server';
import 'server-only';
import { TogglePostRepostSchema, validate } from '@/src/lib/validation';
import { togglePostRelation } from './togglePostRelation';

export async function togglePostRepost(params: { postId: string; isReposted: boolean }) {
   const { postId, isReposted } = validate(TogglePostRepostSchema, params);

   await togglePostRelation({
      table: 'reposts',
      postId,
      isActive: isReposted,
      removeErrorMessage: 'Failed to remove repost',
      addErrorMessage: 'Failed to repost',
   });
}
