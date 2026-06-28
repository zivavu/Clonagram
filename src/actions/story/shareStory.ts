'use server';
import 'server-only';

import { findOrCreateDirectConversation } from '@/src/actions/dm/findOrCreateDirectConversation';
import { promoteParticipantToPrimary } from '@/src/actions/dm/promoteParticipantToPrimary';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { getStoryThumbnail } from '@/src/lib/getStoryThumbnail';
import { throwIfError } from '@/src/lib/unwrap';
import { ShareStorySchema, validate } from '@/src/lib/validation';

export async function shareStory(params: {
   storyId: string;
   recipientIds: string[];
   message?: string;
}) {
   const { storyId, recipientIds, message } = validate(ShareStorySchema, params);
   const { supabase, user } = await getAuthUser();
   const trimmedMessage = message?.trim();

   if (recipientIds.includes(user.id)) throw new Error('Cannot share with yourself');

   const uniqueRecipientIds = [...new Set(recipientIds)];
   const thumbnailUrl = await getStoryThumbnail(supabase, storyId);

   for (const recipientId of uniqueRecipientIds) {
      const conversationId = await findOrCreateDirectConversation(supabase, user.id, recipientId);

      await promoteParticipantToPrimary(supabase, conversationId, user.id);

      const { error: msgError } = await supabase.from('messages').insert({
         conversation_id: conversationId,
         sender_id: user.id,
         story_id: storyId,
         media_url: thumbnailUrl,
         content: null,
      });
      throwIfError({ error: msgError }, 'Failed to send story');
      if (trimmedMessage) {
         const { error: textError } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: trimmedMessage,
         });
         throwIfError({ error: textError }, 'Failed to send message');
      }
   }
}
