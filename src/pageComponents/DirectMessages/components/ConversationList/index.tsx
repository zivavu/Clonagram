'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import UserAvatar from '@/src/components/UserAvatar';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { type ConversationSummaries, getConversationsQuery } from '@/src/queries/conversations';
import {
   getConversationAvatars,
   getConversationDisplayName,
   isUnread,
} from '@/src/utils/conversations';
import { formatTimestamp } from '@/src/utils/formatters';
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
         const supabase = createBrowserClient();
         const { data, error } = await getConversationsQuery(supabase, authUserId, folder);
         if (error) throw error;
         return data ?? [];
      },
      initialData,
      staleTime: Infinity,
   });

   useEffect(() => {
      const supabase = createBrowserClient();
      const channel = supabase
         .channel(`conversations-list-${authUserId}-${folder}`)
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
            queryClient.invalidateQueries({ queryKey: ['conversations', folder, authUserId] });
         })
         .subscribe();
      return () => {
         supabase.removeChannel(channel);
      };
   }, [authUserId, folder, queryClient]);

   return (
      <div {...stylex.props(styles.messagesList)}>
         {conversations.length === 0 && (
            <span style={{ padding: '16px 32px', fontSize: '0.875rem' }}>No conversations yet</span>
         )}
         {conversations.map(summary => {
            const conv = summary.conversation;
            const displayName = getConversationDisplayName(
               conv.participants,
               authUserId,
               conv.title,
            );
            const avatars = getConversationAvatars(conv.participants, authUserId);
            const unread = isUnread(summary, authUserId);
            const href = `${currentFolderHref}/${conv.id}`;

            return (
               <Link key={conv.id} href={href} {...stylex.props(styles.threadItem)}>
                  <UserAvatar
                     src={avatars[0]?.avatar_url ?? null}
                     alt={displayName}
                     size={56}
                     userId={avatars[0]?.id}
                  />
                  <div {...stylex.props(styles.threadContent)}>
                     <span {...stylex.props(styles.threadName, unread && styles.threadNameUnread)}>
                        {displayName}
                     </span>
                     <div {...stylex.props(styles.threadPreviewRow)}>
                        <span
                           {...stylex.props(
                              styles.threadPreview,
                              unread && styles.threadPreviewUnread,
                           )}
                        >
                           {conv.last_message_preview ?? 'No messages yet'}
                        </span>
                        {conv.last_message_at && (
                           <span {...stylex.props(styles.threadTimestamp)}>
                              {' · '}
                              {formatTimestamp(conv.last_message_at)}
                           </span>
                        )}
                     </div>
                  </div>
                  {unread && <div {...stylex.props(styles.unreadDot)} />}
               </Link>
            );
         })}
      </div>
   );
}
