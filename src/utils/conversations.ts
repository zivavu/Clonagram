import type { ConversationSummary } from '@/src/queries/conversations';

type Participant = {
   user_id: string;
   role: string;
   user: { id: string; username: string; full_name: string | null; avatar_url: string | null };
};

export function getConversationDisplayName(
   participants: Participant[],
   authUserId: string,
   title?: string | null,
) {
   if (title) return title;
   const others = participants.filter(p => p.user_id !== authUserId);
   return others.map(p => p.user.full_name || p.user.username).join(', ');
}

export function getConversationAvatars(participants: Participant[], authUserId: string) {
   return participants
      .filter(p => p.user_id !== authUserId)
      .slice(0, 3)
      .map(p => ({ id: p.user.id, avatar_url: p.user.avatar_url, username: p.user.username }));
}

export function isGroupConversation(participants: Participant[]) {
   return participants.length > 2;
}

export function isUnread(summary: ConversationSummary, authUserId: string) {
   if (!summary.conversation.last_message_at) return false;
   if (summary.conversation.last_message_sender_id === authUserId) return false;
   if (!summary.last_read_at) return true;
   return new Date(summary.conversation.last_message_at) > new Date(summary.last_read_at);
}
