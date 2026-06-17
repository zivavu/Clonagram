'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/src/components/AppToast';
import { queryKeys } from '@/src/lib/queryKeys';
import type { ConversationMessages } from '@/src/queries/messages';

export function useSendMessage(conversationId: string) {
   const queryClient = useQueryClient();
   const messagesKey = queryKeys.messages(conversationId);

   return async (
      buildOptimistic: () => ConversationMessages[number],
      sendToServer: () => Promise<void>,
      errorMessage = 'Failed to send',
   ) => {
      const optimistic = buildOptimistic();
      queryClient.setQueryData(messagesKey, (prev: ConversationMessages) => [
         ...(prev ?? []),
         optimistic,
      ]);
      try {
         await sendToServer();
      } catch {
         toast(errorMessage);
      } finally {
         queryClient.invalidateQueries({ queryKey: messagesKey });
         queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
      }
   };
}
