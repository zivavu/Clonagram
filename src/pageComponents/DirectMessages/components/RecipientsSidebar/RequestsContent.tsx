'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoChevronForward, IoEyeOffOutline } from 'react-icons/io5';
import { deleteAllRequests } from '@/src/actions/dm/deleteAllRequests';
import { toast } from '@/src/components/AppToast';
import UserAvatar from '@/src/components/UserAvatar';
import { supabase } from '@/src/lib/supabase/client';
import { type ConversationSummaries, getConversationsQuery } from '@/src/queries/conversations';
import { getConversationAvatars, getConversationDisplayName } from '@/src/utils/conversations';
import { formatTimestamp } from '@/src/utils/time';
import { styles } from './index.stylex';

interface RequestsContentProps {
   authUserId: string;
   initialData: ConversationSummaries;
}

export function RequestsContent({ authUserId, initialData }: RequestsContentProps) {
   const queryClient = useQueryClient();
   const [isDeleting, setIsDeleting] = useState(false);
   const queryKey = ['conversations', 'requests', authUserId];

   const { data: requests = initialData } = useQuery({
      queryKey,
      queryFn: async () => {
         const { data, error } = await getConversationsQuery(supabase, authUserId, 'requests');
         if (error) throw error;
         return data ?? [];
      },
      initialData,
      staleTime: 30_000,
   });

   useEffect(() => {
      const channel = supabase
         .channel(`requests-list-${authUserId}`)
         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
            queryClient.invalidateQueries({ queryKey: ['conversations', 'requests', authUserId] });
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
               queryClient.invalidateQueries({
                  queryKey: ['conversations', 'requests', authUserId],
               });
            },
         )
         .subscribe();
      return () => {
         supabase.removeChannel(channel);
      };
   }, [authUserId, queryClient]);

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
            <Link {...stylex.props(styles.infoLink)} href="/direct/requests">
               Decide who can message you
            </Link>
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
                        username={avatars[0]?.username ?? ''}
                        userId={avatars[0]?.id}
                        disableLink
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

         {requests.length > 0 && (
            <div {...stylex.props(styles.bottomSection)}>
               <button
                  {...stylex.props(styles.deleteAllButton)}
                  disabled={isDeleting}
                  onClick={async () => {
                     setIsDeleting(true);
                     try {
                        await deleteAllRequests();
                        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
                     } catch (e) {
                        toast(e instanceof Error ? e.message : 'Something went wrong.');
                     } finally {
                        setIsDeleting(false);
                     }
                  }}
               >
                  {isDeleting ? 'Deleting...' : `Delete all ${requests.length}`}
               </button>
            </div>
         )}
      </>
   );
}
