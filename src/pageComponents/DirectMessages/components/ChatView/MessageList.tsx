'use client';

import * as stylex from '@stylexjs/stylex';
import type { CallEvent } from '@/src/actions/dm/sendCallEvent';
import UserAvatar from '@/src/components/UserAvatar';
import type { ConversationMessages } from '@/src/queries/messages';
import { DAY_MS, formatGroupSeparator } from '@/src/utils/time';
import { styles } from '../../index.stylex';
import CallEventMessage from './CallEventMessage';
import ImageMessage from './ImageMessage';
import MessageText from './MessageText';
import PostShareMessage from './PostShareMessage';
import StickerMessage from './StickerMessage';
import StoryLikeMessage from './StoryLikeMessage';
import VoiceMessage from './VoiceMessage';

interface MessageListProps {
   messages: ConversationMessages;
   authUserId: string;
   onOpenImage: (src: string) => void;
}

export default function MessageList({ messages, authUserId, onOpenImage }: MessageListProps) {
   return messages.map((msg, idx) => {
      const isSent = msg.sender_id === authUserId;
      const prevMsg = idx > 0 ? messages[idx - 1] : null;
      const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
      const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;
      const gapToPrev = prevMsg
         ? new Date(msg.created_at ?? '').getTime() - new Date(prevMsg.created_at ?? '').getTime()
         : Infinity;
      const showSeparator = gapToPrev > DAY_MS;

      const hasReadReceipt = isSent && msg.read_at && isLastInGroup;

      return (
         <div key={msg.id} {...stylex.props(styles.messageGroup)}>
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
                  <ImageMessage src={msg.media_url} onOpen={onOpenImage} />
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
   });
}
