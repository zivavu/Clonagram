'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/src/lib/supabase/client';
import { type ConversationSummaries, getConversationsQuery } from '@/src/queries/conversations';
import ConversationItem from '../ConversationItem';
import { styles } from '../RecipientsSidebar/index.stylex';

interface ConversationListProps {
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
   initialData: ConversationSummaries;
}

export default function ConversationList({
   authUserId,
   folder,
   currentFolderHref,
   initialData,
}: ConversationListProps) {
   const queryClient = useQueryClient();
   const queryKey = ['conversations', folder, authUserId];

   const { data: conversations = initialData } = useQuery({
      queryKey,
      queryFn: async () => {
         const { data, error } = await getConversationsQuery(supabase, authUserId, folder);
         if (error) throw error;
         return data ?? [];
      },
      initialData,
      staleTime: 30_000,
   });

   useEffect(() => {
      const channel = supabase
         .channel(`conversations-list-${authUserId}-${folder}`)
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
            queryClient.invalidateQueries({ queryKey: ['conversations', folder, authUserId] });
         })
         .on(
            'postgres_changes',
            {
               event: 'UPDATE',
               schema: 'public',
               table: 'conversation_participants',
               filter: `user_id=eq.${authUserId}`,
            },
            () => {
               queryClient.invalidateQueries({ queryKey: ['conversations', folder, authUserId] });
            },
         )
         .on(
            'postgres_changes',
            {
               event: 'DELETE',
               schema: 'public',
               table: 'conversation_participants',
               filter: `user_id=eq.${authUserId}`,
            },
            () => {
               queryClient.invalidateQueries({ queryKey: ['conversations', folder, authUserId] });
            },
         )
         .subscribe();
      return () => {
         supabase.removeChannel(channel);
      };
   }, [authUserId, folder, queryClient]);

   return (
      <ul {...stylex.props(styles.messagesList)}>
         {conversations.length === 0 && (
            <span style={{ padding: '16px 32px', fontSize: '0.875rem' }}>No conversations yet</span>
         )}
         {conversations.map(summary => (
            <ConversationItem
               key={summary.conversation.id}
               summary={summary}
               authUserId={authUserId}
               folder={folder}
               currentFolderHref={currentFolderHref}
            />
         ))}
      </ul>
   );
}
