'use client';

import { useState } from 'react';
import type { ConversationDetail } from '@/src/queries/conversations';
import type { ConversationMessages } from '@/src/queries/messages';
import ChatView from '../ChatView';
import GroupDetailsPanel from '../GroupDetailsPanel';

interface ChatLayoutProps {
   conversationId: string;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   initialMessages: ConversationMessages;
   initialConversation: ConversationDetail;
   isGroup: boolean;
}

export default function ChatLayout({
   conversationId,
   authUserId,
   folder,
   initialMessages,
   initialConversation,
   isGroup,
}: ChatLayoutProps) {
   const [showDetails, setShowDetails] = useState(false);

   return (
      <>
         <ChatView
            conversationId={conversationId}
            authUserId={authUserId}
            folder={folder}
            initialMessages={initialMessages}
            initialConversation={initialConversation}
            onInfoClick={() => setShowDetails(v => !v)}
         />
         {isGroup && showDetails && (
            <GroupDetailsPanel
               conversationId={conversationId}
               authUserId={authUserId}
               initialConversation={initialConversation}
            />
         )}
      </>
   );
}
