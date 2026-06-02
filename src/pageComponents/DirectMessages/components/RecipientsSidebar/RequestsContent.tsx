'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoChevronForward, IoEyeOffOutline } from 'react-icons/io5';
import UserAvatar from '@/src/components/UserAvatar';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { type ConversationSummaries, getConversationsQuery } from '@/src/queries/conversations';
import { getConversationAvatars, getConversationDisplayName } from '@/src/utils/conversations';
import { formatTimestamp } from '@/src/utils/formatters';
import { styles } from './index.stylex';

interface RequestsContentProps {
   authUserId: string;
   initialData: ConversationSummaries;
}

export function RequestsContent({ authUserId, initialData }: RequestsContentProps) {
   const queryClient = useQueryClient();
   const queryKey = useMemo(() => ['conversations', 'requests', authUserId], [authUserId]);

   const { data: requests = initialData } = useQuery({
      queryKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await getConversationsQuery(supabase, authUserId, 'requests');
         if (error) throw error;
         return data ?? [];
      },
      initialData,
      staleTime: Infinity,
   });

   useEffect(() => {
      const supabase = createBrowserClient();
      const channel = supabase
         .channel(`requests-list-${authUserId}`)
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
            queryClient.invalidateQueries({ queryKey });
         })
         .subscribe();
      return () => {
         supabase.removeChannel(channel);
      };
   }, [authUserId, queryClient, queryKey]);

   return (
      <>
         <div {...stylex.props(styles.requestsHeader)}>
            <Link
               href="/direct"
               {...stylex.props(styles.backButton)}
               aria-label="Back to messages"
               role="button"
            >
               <FaArrowLeft size={24} />
            </Link>
            <span {...stylex.props(styles.headerTitle)}>Message requests</span>
         </div>

         <div {...stylex.props(styles.infoBanner)}>
            <p {...stylex.props(styles.infoText)}>
               Open a chat to get more info about who&apos;s messaging you. They won&apos;t know
               you&apos;ve seen it until you accept.
            </p>
            <a {...stylex.props(styles.infoLink)} href="/accounts/privacy_and_security/">
               Decide who can message you
            </a>
         </div>

         <div {...stylex.props(styles.requestsBody)}>
            <button {...stylex.props(styles.hiddenRequestsRow)} aria-label="Hidden Requests">
               <div {...stylex.props(styles.hiddenRequestsAvatar)}>
                  <IoEyeOffOutline size={22} />
               </div>
               <span {...stylex.props(styles.hiddenRequestsLabel)}>Hidden Requests</span>
               <IoChevronForward size={16} />
            </button>

            {requests.map(summary => {
               const conv = summary.conversation;
               const displayName = getConversationDisplayName(
                  conv.participants,
                  authUserId,
                  conv.title,
               );
               const avatars = getConversationAvatars(conv.participants, authUserId);

               return (
                  <Link
                     key={conv.id}
                     href={`/direct/requests/${conv.id}`}
                     {...stylex.props(styles.threadItem)}
                  >
                     <UserAvatar
                        src={avatars[0]?.avatar_url ?? null}
                        alt={displayName}
                        size={56}
                        userId={avatars[0]?.id}
                     />
                     <div {...stylex.props(styles.threadContent)}>
                        <span {...stylex.props(styles.threadName)}>{displayName}</span>
                        <div {...stylex.props(styles.threadPreviewRow)}>
                           <span {...stylex.props(styles.threadPreview)}>
                              {conv.last_message_preview ?? ''}
                           </span>
                           {conv.last_message_at && (
                              <span {...stylex.props(styles.threadTimestamp)}>
                                 {' · '}
                                 {formatTimestamp(conv.last_message_at)}
                              </span>
                           )}
                        </div>
                     </div>
                  </Link>
               );
            })}
         </div>

         <div {...stylex.props(styles.bottomSection)}>
            <button {...stylex.props(styles.deleteAllButton)}>Delete all {requests.length}</button>
         </div>
      </>
   );
}
