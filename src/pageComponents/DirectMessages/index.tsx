import * as stylex from '@stylexjs/stylex';
import { RiUserReceived2Line } from 'react-icons/ri';
import { VscSend } from 'react-icons/vsc';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { getConversationQuery, getConversationsQuery } from '@/src/queries/conversations';
import type { ConversationMessages } from '@/src/queries/messages';
import { getMessagesQuery } from '@/src/queries/messages';
import { isGroupConversation } from '@/src/utils/conversations';
import ChatLayout from './components/ChatLayout';
import NewMessageModal from './components/NewMessageModal';
import NewMessageTrigger from './components/NewMessageModal/NewMessageTrigger';
import RecipientsSidebar from './components/RecipientsSidebar/index';
import { styles } from './index.stylex';

interface DirectMessagesPageProps {
   chatId?: string;
   isRequestsPage?: boolean;
   currentFolderHref?: string;
}

export default async function DirectMessagesPage({
   chatId,
   isRequestsPage = false,
   currentFolderHref = '/direct',
}: DirectMessagesPageProps) {
   const profile = await getAuthProfile();
   const authUserId = profile?.id ?? '';
   const supabase = await createServerClient();

   const folder: 'primary' | 'general' | 'requests' = isRequestsPage
      ? 'requests'
      : currentFolderHref === '/direct/general'
        ? 'general'
        : 'primary';

   const { data: conversations } = await getConversationsQuery(supabase, authUserId, folder);

   let initialConversation = null;
   let initialMessages: ConversationMessages = [];

   if (chatId) {
      const [convResult, msgsResult] = await Promise.all([
         getConversationQuery(supabase, chatId),
         getMessagesQuery(supabase, chatId),
      ]);
      initialConversation = convResult.data;
      initialMessages = msgsResult.data ?? [];
   }

   const isChatSelected = !!chatId && !!initialConversation;
   const isGroup = isChatSelected && isGroupConversation(initialConversation?.participants ?? []);

   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar
            authUserId={authUserId}
            currentFolderHref={currentFolderHref}
            isRequestsPage={isRequestsPage}
            initialConversations={conversations ?? []}
            folder={folder}
         />
         <div {...stylex.props(styles.chatContainer)}>
            {!isChatSelected && !isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <VscSend {...stylex.props(styles.messageIcon)} />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Your messages</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     Send a message to start a chat.
                  </div>
                  <NewMessageTrigger styleProps={stylex.props(styles.sendMessageButton)}>
                     Send message
                  </NewMessageTrigger>
               </div>
            )}
            {!isChatSelected && isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <RiUserReceived2Line {...stylex.props(styles.requestsIcon)} />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Message requests</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     These messages are from people you&apos;ve restricted or don&apos;t follow.
                     They won&apos;t know you viewed their request until you allow them to message
                     you.
                  </div>
               </div>
            )}
            {isChatSelected && initialConversation && (
               <ChatLayout
                  conversationId={chatId}
                  authUserId={authUserId}
                  folder={folder}
                  initialMessages={initialMessages}
                  initialConversation={initialConversation}
                  isGroup={isGroup}
               />
            )}
         </div>
         <NewMessageModal />
      </div>
   );
}
