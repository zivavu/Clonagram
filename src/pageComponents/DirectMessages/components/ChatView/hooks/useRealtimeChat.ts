import type { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';

export function useRealtimeChat(conversationId: string, queryClient: QueryClient) {
   useEffect(() => {
      const channel = supabase
         .channel(`messages-${conversationId}`)
         .on(
            'postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'messages',
               filter: `conversation_id=eq.${conversationId}`,
            },
            () => {
               queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) });
               queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
            },
         )
         .on(
            'postgres_changes',
            {
               event: 'UPDATE',
               schema: 'public',
               table: 'messages',
               filter: `conversation_id=eq.${conversationId}`,
            },
            () => {
               queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) });
            },
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
      };
   }, [conversationId, queryClient]);
}
