import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { getConversationQuery } from '@/src/queries/conversations';
import { getMessagesQuery } from '@/src/queries/messages';
import { isGroupConversation } from '@/src/utils/conversations';
import ChatLayout from '../ChatLayout';
import EmptyState from '../EmptyState';

interface DirectChatProps {
   chatId: string;
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
   emptyVariant: 'messages' | 'requests';
}

export default async function DirectChat({
   chatId,
   folder,
   currentFolderHref,
   emptyVariant,
}: DirectChatProps) {
   const profile = await getAuthProfile();
   const authUserId = profile?.id ?? '';
   const supabase = await createServerClient();
   const [{ data: conversation }, { data: messages }] = await Promise.all([
      getConversationQuery(supabase, chatId),
      getMessagesQuery(supabase, chatId),
   ]);

   if (!conversation) {
      return <EmptyState variant={emptyVariant} />;
   }

   return (
      <ChatLayout
         conversationId={chatId}
         authUserId={authUserId}
         folder={folder}
         currentFolderHref={currentFolderHref}
         initialMessages={messages ?? []}
         initialConversation={conversation}
         isGroup={isGroupConversation(conversation.participants ?? [])}
      />
   );
}
