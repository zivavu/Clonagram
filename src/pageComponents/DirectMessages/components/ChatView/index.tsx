'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { markConversationRead } from '@/src/actions/dm/markConversationRead';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { supabase } from '@/src/lib/supabase/client';
import { type ConversationDetail, getConversationQuery } from '@/src/queries/conversations';
import { type ConversationMessages, getMessagesQuery } from '@/src/queries/messages';
import {
   getConversationAvatars,
   getConversationDisplayName,
   isGroupConversation,
} from '@/src/utils/conversations';
import { formatGroupSeparator } from '@/src/utils/time';
import { styles } from '../../index.stylex';
import MessageInput from './MessageInput';
import RequestActions from './RequestActions';

const MS_PER_DAY = 86_400_000;

interface ChatViewProps {
   conversationId: string;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   initialMessages: ConversationMessages;
   initialConversation: ConversationDetail;
   onInfoClick: () => void;
}

export default function ChatView({
   conversationId,
   authUserId,
   folder,
   initialMessages,
   initialConversation,
   onInfoClick,
}: ChatViewProps) {
   const queryClient = useQueryClient();
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const messagesKey = ['messages', conversationId];

   const { data: messages = initialMessages } = useQuery({
      queryKey: messagesKey,
      queryFn: async () => {
         const { data, error } = await getMessagesQuery(supabase, conversationId);
         if (error) throw error;
         return data ?? [];
      },
      initialData: initialMessages,
      staleTime: 0,
   });

   const { data: conversation = initialConversation } = useQuery({
      queryKey: ['conversation', conversationId],
      queryFn: async () => {
         const { data, error } = await getConversationQuery(supabase, conversationId);
         if (error) throw error;
         return data;
      },
      initialData: initialConversation,
      staleTime: Infinity,
   });

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
               queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
               queryClient.invalidateQueries({ queryKey: ['conversations'] });
               markConversationRead(conversationId);
            },
         )
         .subscribe();
      return () => {
         supabase.removeChannel(channel);
      };
   }, [conversationId, queryClient]);

   useEffect(() => {
      markConversationRead(conversationId);
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
   }, [conversationId]);

   const messagesCount = messages.length;
   // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when message count changes
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messagesCount]);

   const participants = conversation?.participants ?? [];
   const displayName = getConversationDisplayName(participants, authUserId, conversation?.title);
   const avatars = getConversationAvatars(participants, authUserId);
   const isGroup = isGroupConversation(participants);
   const isRequest = folder === 'requests';
   const otherParticipant = participants.find(p => p.user_id !== authUserId)?.user;

   return (
      <>
         <div {...stylex.props(styles.chatTopBar)}>
            <div {...stylex.props(styles.chatTopBarRecipient)}>
               <UserAvatar
                  src={avatars[0]?.avatar_url ?? null}
                  alt={displayName}
                  size={44}
                  userId={avatars[0]?.id}
               />
               <div>
                  <div {...stylex.props(styles.chatTopBarRecipientName)}>{displayName}</div>
                  {!isGroup && otherParticipant && (
                     <OtherUserUsername
                        style={styles.chatTopBarRecipientUsername}
                        userProfile={otherParticipant}
                     />
                  )}
               </div>
            </div>
            <div {...stylex.props(styles.chatTopBarActions)}>
               <IoCallOutline {...stylex.props(styles.chatTopBarActionIcon)} />
               <HiOutlineVideoCamera {...stylex.props(styles.chatTopBarActionIcon)} />
               <IoInformationCircleOutline
                  {...stylex.props(styles.chatTopBarActionIcon)}
                  onClick={onInfoClick}
               />
            </div>
         </div>

         <div {...stylex.props(styles.messagesContainer)}>
            {!isGroup && otherParticipant && (
               <div {...stylex.props(styles.chatProfileHeader)}>
                  <UserAvatar
                     src={otherParticipant.avatar_url}
                     alt={otherParticipant.username}
                     size={96}
                     userId={otherParticipant.id}
                  />
                  <OtherUserUsername
                     style={styles.chatProfileUsername}
                     userProfile={otherParticipant}
                  />
                  <div {...stylex.props(styles.chatProfileSubtitle)}>Clonagram</div>
                  <Link
                     href={`/profile/${otherParticipant.username}`}
                     {...stylex.props(styles.chatProfileButton)}
                  >
                     View profile
                  </Link>
               </div>
            )}

            {messages.map((msg, idx) => {
               const isSent = msg.sender_id === authUserId;
               const prevMsg = idx > 0 ? messages[idx - 1] : null;
               const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
               const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;
               const gapToPrev = prevMsg
                  ? new Date(msg.created_at ?? '').getTime() -
                    new Date(prevMsg.created_at ?? '').getTime()
                  : Infinity;
               const showSeparator = gapToPrev > MS_PER_DAY;

               return (
                  <div key={msg.id} style={{ display: 'contents' }}>
                     {showSeparator && msg.created_at && (
                        <div {...stylex.props(styles.dateSeparator)}>
                           <span {...stylex.props(styles.dateSeparatorText)}>
                              {formatGroupSeparator(msg.created_at)}
                           </span>
                        </div>
                     )}
                     <div
                        {...stylex.props(
                           styles.messageRow,
                           isSent ? styles.messageRowSent : styles.messageRowReceived,
                        )}
                     >
                        {!isSent && (
                           <div {...stylex.props(styles.messageAvatarSlot)}>
                              {isLastInGroup && (
                                 <UserAvatar
                                    src={msg.sender.avatar_url}
                                    alt={msg.sender.username}
                                    size={28}
                                    userId={msg.sender.id}
                                 />
                              )}
                           </div>
                        )}
                        <div
                           {...stylex.props(
                              styles.messageBubble,
                              isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
                           )}
                        >
                           {msg.content}
                        </div>
                     </div>
                  </div>
               );
            })}
            <div ref={messagesEndRef} />
         </div>

         {isRequest ? (
            <RequestActions
               conversationId={conversationId}
               authUserId={authUserId}
               senderUserId={participants.find(p => p.user_id !== authUserId)?.user_id ?? ''}
               senderProfile={otherParticipant ?? null}
            />
         ) : (
            <MessageInput
               conversationId={conversationId}
               onSent={() => {
                  queryClient.invalidateQueries({ queryKey: messagesKey });
                  queryClient.invalidateQueries({ queryKey: ['conversations'] });
               }}
            />
         )}
      </>
   );
}
