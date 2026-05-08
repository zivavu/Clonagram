import type { MessageThread } from '@/src/mocks/messageThreads';
import { CURRENT_USER } from '@/src/mocks/users';

export function getThreadDisplayName(thread: MessageThread): string {
   if (thread.participants.length === 1) {
      return thread.participants[0].full_name || thread.participants[0].username;
   }
   return thread.participants.map(p => p.full_name || p.username).join(', ');
}

export function getLastMessagePreview(thread: MessageThread): string {
   const lastMsg = thread.messages[thread.messages.length - 1];
   const isFromMe = lastMsg.senderId === CURRENT_USER.id;
   const prefix = isFromMe ? 'You: ' : '';
   const text = lastMsg.text.length > 50 ? `${lastMsg.text.slice(0, 50)}...` : lastMsg.text;
   return prefix + text;
}

export function hasUnreadMessages(thread: MessageThread): boolean {
   return thread.messages.some(m => m.senderId !== CURRENT_USER.id && !m.seen);
}
