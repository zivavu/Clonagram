import { useEffect, useRef } from 'react';
import { markChatRead } from '@/src/actions/dm/markChatRead';
import type { ConversationDetail } from '@/src/queries/conversations';
import type { ConversationMessages } from '@/src/queries/messages';

const AT_BOTTOM_THRESHOLD = 300;

interface Params {
   containerRef: React.RefObject<HTMLDivElement | null>;
   endRef: React.RefObject<HTMLDivElement | null>;
   messages: ConversationMessages;
   conversationId: string;
   authUserId: string;
   initialConversation: ConversationDetail;
}

function isAtBottom(container: HTMLDivElement) {
   return (
      container.scrollHeight - container.scrollTop - container.clientHeight < AT_BOTTOM_THRESHOLD
   );
}

export function useChatScrollAndRead({
   containerRef,
   endRef,
   messages,
   conversationId,
   authUserId,
   initialConversation,
}: Params) {
   const messagesCount = messages.length;
   const lastReadCountRef = useRef(0);

   const markReadIfNeededRef = useRef<() => void>(() => {});
   markReadIfNeededRef.current = () => {
      if (messagesCount === lastReadCountRef.current) return;
      lastReadCountRef.current = messagesCount;
      const hasUnread = messages.some(m => m.sender_id !== authUserId && !m.read_at);
      if (hasUnread) markChatRead(conversationId);
   };

   // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per conversation — syncs read ref, marks read if needed, scrolls to bottom, attaches stable scroll listener
   useEffect(() => {
      lastReadCountRef.current = messagesCount;

      const self = initialConversation?.participants.find(p => p.user_id === authUserId);
      const isUnread =
         !self?.last_read_at ||
         (initialConversation?.last_message_at &&
            new Date(initialConversation.last_message_at) > new Date(self.last_read_at));
      if (isUnread) markChatRead(conversationId);

      endRef.current?.scrollIntoView({ behavior: 'instant' });

      const container = containerRef.current;
      if (!container) return;

      const scrollHandler = () => {
         if (isAtBottom(container)) markReadIfNeededRef.current();
      };
      container.addEventListener('scroll', scrollHandler, { passive: true });
      return () => container.removeEventListener('scroll', scrollHandler);
   }, [conversationId]);

   // biome-ignore lint/correctness/useExhaustiveDependencies: runs when new messages arrive — scrolls to bottom if already there and marks read
   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      if (isAtBottom(container)) {
         endRef.current?.scrollIntoView({ behavior: 'instant' });
         markReadIfNeededRef.current();
      }
   }, [messagesCount]);
}
