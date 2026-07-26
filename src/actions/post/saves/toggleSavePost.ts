'use server';
import 'server-only';
import { TogglePostSaveSchema, validate } from '@/src/lib/validation';
import { togglePostRelation } from '../togglePostRelation';

export async function toggleSavePost(params: { postId: string; isSaved: boolean }) {
   const { postId, isSaved } = validate(TogglePostSaveSchema, params);

   await togglePostRelation({
      table: 'saves',
      postId,
      isActive: isSaved,
      removeErrorMessage: 'Failed to unsave post',
      addErrorMessage: 'Failed to save post',
   });
}
