'use server';
import 'server-only';
import { findOrCreateDirectConversation } from '@/src/actions/dm/findOrCreateDirectConversation';
import { promoteParticipantToPrimary } from '@/src/actions/dm/promoteParticipantToPrimary';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { SharePostSchema, validate } from '@/src/lib/validation';

export async function sharePost(params: {
   postId: string;
   recipientIds: string[];
   message?: string;
}) {
   const { postId, recipientIds, message } = validate(SharePostSchema, params);
   const { supabase, user } = await getAuthUser();
   if (recipientIds.includes(user.id)) throw new Error('Cannot share with yourself');
   const uniqueRecipientIds = [...new Set(recipientIds)];
   const trimmedMessage = message?.trim();

   for (const recipientId of uniqueRecipientIds) {
      const conversationId = await findOrCreateDirectConversation(supabase, user.id, recipientId);

      await promoteParticipantToPrimary(supabase, conversationId, user.id);

      const { error: msgError } = await supabase.from('messages').insert({
         conversation_id: conversationId,
         sender_id: user.id,
         post_id: postId,
         content: null,
      });
      throwIfError({ error: msgError }, 'Failed to send post');

      if (trimmedMessage) {
         const { error: textError } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: trimmedMessage,
         });
         throwIfError({ error: textError }, 'Failed to send message');
      }

      const { error: shareError } = await supabase.from('post_shares').insert({
         post_id: postId,
         sender_id: user.id,
         recipient_id: recipientId,
      });
      throwIfError({ error: shareError }, 'Failed to record share');
   }
}
