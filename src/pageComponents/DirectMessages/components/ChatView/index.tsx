'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaArrowLeft } from 'react-icons/fa6';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline } from 'react-icons/io5';
import type { CallEvent } from '@/src/actions/dm/sendCallEvent';
import { sendImage } from '@/src/actions/dm/sendImage';
import { sendMessage } from '@/src/actions/dm/sendMessage';
import { sendSticker } from '@/src/actions/dm/sendSticker';
import { sendVoiceMessage } from '@/src/actions/dm/sendVoiceMessage';
import { toast } from '@/src/components/AppToast';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { type ConversationDetail, getConversationQuery } from '@/src/queries/conversations';
import {
   type ConversationMessage,
   type ConversationMessages,
   getMessagesQuery,
} from '@/src/queries/messages';
import { compressMessageImage } from '@/src/utils/compressMessageImage';
import {
   getConversationAvatars,
   getConversationDisplayName,
   isGroupConversation,
} from '@/src/utils/conversations';
import { DAY_MS, formatGroupSeparator } from '@/src/utils/time';
import { styles } from '../../index.stylex';
import CallEventMessage from './CallEventMessage';
import { useChatScrollAndRead } from './hooks/useChatScrollAndRead';
import { useRealtimeChat } from './hooks/useRealtimeChat';
import ImageMessage from './ImageMessage';
import ImageViewModal from './ImageViewModal';
import MessageInput, { type MessageInputHandle } from './MessageInput';
import MessageText from './MessageText';
import PostShareMessage from './PostShareMessage';
import RequestActions from './RequestActions';
import StickerMessage from './StickerMessage';
import StoryLikeMessage from './StoryLikeMessage';
import VoiceMessage from './VoiceMessage';
import VoiceRecorder from './VoiceRecorder';

interface ChatViewProps {
   conversationId: string;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
   initialMessages: ConversationMessages;
   initialConversation: ConversationDetail;
   onInfoClick: () => void;
}

export default function ChatView({
   conversationId,
   authUserId,
   folder,
   currentFolderHref,
   initialMessages,
   initialConversation,
   onInfoClick,
}: ChatViewProps) {
   const queryClient = useQueryClient();
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const messagesContainerRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<MessageInputHandle>(null);
   const messagesKey = queryKeys.messages(conversationId);
   const [viewingImage, setViewingImage] = useState<string | null>(null);
   const [isRecording, setIsRecording] = useState(false);

   const { getRootProps, isDragActive } = useDropzone({
      noClick: true,
      noKeyboard: true,
      accept: { 'image/*': [] },
      maxSize: 25 * 1024 * 1024,
      onDrop: accepted => {
         if (accepted.length) inputRef.current?.addFiles(accepted);
      },
      onDropRejected: rejections => {
         for (const r of rejections) toast(`${r.file.name} is too large or not an image`);
      },
   });

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
      queryKey: queryKeys.conversation(conversationId),
      queryFn: async () => {
         const { data, error } = await getConversationQuery(supabase, conversationId);
         if (error) throw error;
         return data;
      },
      initialData: initialConversation,
      staleTime: Infinity,
   });

   useRealtimeChat(conversationId, queryClient);

   useChatScrollAndRead({
      containerRef: messagesContainerRef,
      endRef: messagesEndRef,
      messages,
      conversationId,
      authUserId,
      initialConversation,
   });

   function createOptimisticMessage(overrides: Partial<ConversationMessage>) {
      const id = `optimistic-${Date.now()}`;
      return {
         id,
         content: null,
         call_event: null,
         sticker_url: null,
         media_url: null,
         audio_url: null,
         story_id: null,
         post_id: null,
         post: null,
         created_at: new Date().toISOString(),
         sender_id: authUserId,
         is_deleted: false,
         reply_to_id: null,
         read_at: null,
         story: null,
         sender: authProfile ?? {
            id: authUserId,
            username: '',
            full_name: null,
            avatar_url: null,
         },
         ...overrides,
      } satisfies ConversationMessage;
   }

   const participants = conversation?.participants ?? [];
   const authProfile = participants.find(p => p.user_id === authUserId)?.user;
   const displayName = getConversationDisplayName(participants, authUserId, conversation?.title);
   const avatars = getConversationAvatars(participants, authUserId);
   const isGroup = isGroupConversation(participants);
   const isRequest = folder === 'requests';
   const otherParticipant = participants.find(p => p.user_id !== authUserId)?.user;

   return (
      <div {...getRootProps()} {...stylex.props(styles.chatViewRoot)}>
         <div {...stylex.props(styles.chatTopBar)}>
            <div {...stylex.props(styles.chatTopBarRecipient)}>
               <Link
                  href={currentFolderHref}
                  {...stylex.props(styles.backButton)}
                  aria-label="Back to messages"
               >
                  <FaArrowLeft {...stylex.props(styles.backButtonIcon)} />
               </Link>
               <UserAvatar
                  src={avatars[0]?.avatar_url ?? null}
                  alt={displayName}
                  size={44}
                  username={avatars[0]?.username ?? ''}
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
               <Link
                  href={`${currentFolderHref}/${conversationId}/call?type=audio`}
                  {...stylex.props(
                     styles.chatTopBarActionIcon,
                     styles.chatTopBarActionMobileHidden,
                  )}
                  aria-label="Voice call"
               >
                  <IoCallOutline />
               </Link>
               <Link
                  href={`${currentFolderHref}/${conversationId}/call?type=video`}
                  {...stylex.props(
                     styles.chatTopBarActionIcon,
                     styles.chatTopBarActionMobileHidden,
                  )}
                  aria-label="Video call"
               >
                  <HiOutlineVideoCamera />
               </Link>
               <IoInformationCircleOutline
                  {...stylex.props(styles.chatTopBarActionIcon)}
                  onClick={onInfoClick}
               />
            </div>
         </div>

         {isDragActive && (
            <div {...stylex.props(styles.dropOverlay)}>
               <span {...stylex.props(styles.dropTitle)}>Drop files here</span>
               <span {...stylex.props(styles.dropSubtitle)}>max 25 MB</span>
            </div>
         )}

         <div ref={messagesContainerRef} {...stylex.props(styles.messagesContainer)}>
            {!isGroup && otherParticipant && (
               <div {...stylex.props(styles.chatProfileHeader)}>
                  <UserAvatar
                     src={otherParticipant.avatar_url}
                     alt={otherParticipant.username}
                     size={96}
                     username={otherParticipant.username}
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
               const showSeparator = gapToPrev > DAY_MS;

               const hasReadReceipt = isSent && msg.read_at && isLastInGroup;

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
                                    username={msg.sender.username}
                                    userId={msg.sender.id}
                                 />
                              )}
                           </div>
                        )}
                        {msg.call_event ? (
                           <CallEventMessage
                              event={msg.call_event as CallEvent}
                              senderUsername={msg.sender.username}
                              isSelf={isSent}
                           />
                        ) : msg.sticker_url ? (
                           <StickerMessage src={msg.sticker_url} />
                        ) : msg.story_id ? (
                           <StoryLikeMessage
                              storyId={msg.story_id}
                              storyUsername={msg.story?.profiles?.username ?? ''}
                              thumbnailUrl={msg.media_url}
                           />
                        ) : msg.post_id && msg.post ? (
                           <PostShareMessage post={msg.post} />
                        ) : msg.audio_url ? (
                           <VoiceMessage src={msg.audio_url} />
                        ) : msg.media_url ? (
                           <ImageMessage src={msg.media_url} onOpen={setViewingImage} />
                        ) : (
                           <div
                              {...stylex.props(
                                 styles.messageBubble,
                                 isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
                              )}
                           >
                              <MessageText content={msg.content ?? ''} />
                           </div>
                        )}
                     </div>
                     {msg.story_id && msg.content && (
                        <div
                           {...stylex.props(
                              styles.messageRow,
                              isSent ? styles.messageRowSent : styles.messageRowReceived,
                           )}
                        >
                           {!isSent && <div {...stylex.props(styles.messageAvatarSlot)} />}
                           <div
                              {...stylex.props(
                                 styles.messageBubble,
                                 isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
                              )}
                           >
                              <MessageText content={msg.content} />
                           </div>
                        </div>
                     )}
                     {hasReadReceipt && (
                        <div {...stylex.props(styles.messageRow, styles.messageRowSent)}>
                           <div {...stylex.props(styles.readReceipt)}>Seen</div>
                        </div>
                     )}
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
         ) : isRecording ? (
            <VoiceRecorder
               onCancel={() => setIsRecording(false)}
               onSend={async (blob: Blob) => {
                  const previewUrl = URL.createObjectURL(blob);
                  const optimisticMsg = createOptimisticMessage({ audio_url: previewUrl });
                  queryClient.setQueryData(messagesKey, (prev: ConversationMessages) => [
                     ...(prev ?? []),
                     optimisticMsg,
                  ]);
                  try {
                     const fileName = `${crypto.randomUUID()}.webm`;
                     const { error: uploadError } = await supabase.storage
                        .from('messages')
                        .upload(fileName, blob, { contentType: blob.type || 'audio/webm' });
                     if (uploadError) throw uploadError;
                     const { data: urlData } = supabase.storage
                        .from('messages')
                        .getPublicUrl(fileName);
                     await sendVoiceMessage(conversationId, urlData.publicUrl);
                  } catch {
                     toast('Failed to send voice message');
                  } finally {
                     URL.revokeObjectURL(previewUrl);
                     setIsRecording(false);
                     queryClient.invalidateQueries({ queryKey: messagesKey });
                     queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
                  }
               }}
            />
         ) : (
            <MessageInput
               ref={inputRef}
               onStartRecording={() => setIsRecording(true)}
               onSendSticker={async (url: string) => {
                  const optimisticMsg = createOptimisticMessage({ sticker_url: url });
                  queryClient.setQueryData(messagesKey, (prev: ConversationMessages) => [
                     ...(prev ?? []),
                     optimisticMsg,
                  ]);
                  try {
                     await sendSticker(conversationId, url);
                  } catch {
                     toast('Failed to send sticker');
                  } finally {
                     queryClient.invalidateQueries({ queryKey: messagesKey });
                     queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
                  }
               }}
               onSend={async text => {
                  const optimisticMsg = createOptimisticMessage({ content: text });

                  queryClient.setQueryData(messagesKey, (prev: ConversationMessages) => [
                     ...(prev ?? []),
                     optimisticMsg,
                  ]);

                  try {
                     await sendMessage(conversationId, text);
                  } catch {
                     toast('Failed to send message');
                  } finally {
                     queryClient.invalidateQueries({ queryKey: messagesKey });
                     queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
                  }
               }}
               onSendImages={async (files: File[]) => {
                  for (const file of files) {
                     const previewUrl = URL.createObjectURL(file);
                     const optimisticMsg = createOptimisticMessage({ media_url: previewUrl });
                     queryClient.setQueryData(messagesKey, (prev: ConversationMessages) => [
                        ...(prev ?? []),
                        optimisticMsg,
                     ]);

                     try {
                        const blob = await compressMessageImage(file);
                        const fileName = `${crypto.randomUUID()}.webp`;
                        const compressed = new File([blob], fileName, { type: 'image/webp' });
                        const { error: uploadError } = await supabase.storage
                           .from('messages')
                           .upload(fileName, compressed);
                        if (uploadError) throw uploadError;
                        const { data: urlData } = supabase.storage
                           .from('messages')
                           .getPublicUrl(fileName);
                        await sendImage(conversationId, urlData.publicUrl);
                     } catch {
                        toast('Failed to send image');
                     } finally {
                        URL.revokeObjectURL(previewUrl);
                        queryClient.invalidateQueries({ queryKey: messagesKey });
                        queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
                     }
                  }
               }}
            />
         )}

         <ImageViewModal
            src={viewingImage}
            open={!!viewingImage}
            onClose={() => setViewingImage(null)}
         />
      </div>
   );
}
