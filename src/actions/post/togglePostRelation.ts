import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { getAuthUser } from '../getAuthUser';

type PostRelationTable = 'likes' | 'reposts' | 'saves';

interface TogglePostRelationParams {
   table: PostRelationTable;
   postId: string;
   isActive: boolean;
   removeErrorMessage: string;
   addErrorMessage: string;
}

export async function togglePostRelation({
   table,
   postId,
   isActive,
   removeErrorMessage,
   addErrorMessage,
}: TogglePostRelationParams) {
   const { supabase, user } = await getAuthUser();

   if (isActive) {
      const { error } = await supabase
         .from(table)
         .delete()
         .eq('post_id', postId)
         .eq('user_id', user.id);
      throwIfError({ error }, removeErrorMessage);
      return;
   }

   const { error } = await supabase.from(table).insert({ post_id: postId, user_id: user.id });
   throwIfError({ error }, addErrorMessage);
}
