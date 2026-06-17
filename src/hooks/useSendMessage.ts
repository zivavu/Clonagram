'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from '@/src/components/AppToast';
import { queryKeys } from '@/src/lib/queryKeys';
import type { ConversationMessages } from '@/src/queries/messages';

export function useSendMessage(conversationId: string) {
   const queryClient = useQueryClient();
   const messagesKey = queryKeys.messages(conversationId);

   const send = useCallback(
      async (
         buildOptimistic: () => ConversationMessages[number],
         sendToServer: () => Promise<void>,
      ) => {
         const optimistic = buildOptimistic();
         queryClient.setQueryData(messagesKey, (prev: ConversationMessages) => [
            ...(prev ?? []),
            optimistic,
         ]);
         try {
            await sendToServer();
         } catch {
            toast('Failed to send');
         } finally {
            queryClient.invalidateQueries({ queryKey: messagesKey });
            queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
         }
      },
      [conversationId, messagesKey, queryClient],
   );

   return send;
}
