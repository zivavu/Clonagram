'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { ConversationDetail } from '@/src/queries/conversations';
import type { ConversationMessages } from '@/src/queries/messages';
import ChatDetailsPanel from '../ChatDetailsPanel';
import ChatView from '../ChatView';
import { styles } from './index.stylex';

interface ChatLayoutProps {
   conversationId: string;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
   initialMessages: ConversationMessages;
   initialConversation: ConversationDetail;
   isGroup: boolean;
}

export default function ChatLayout({
   conversationId,
   authUserId,
   folder,
   currentFolderHref,
   initialMessages,
   initialConversation,
   isGroup,
}: ChatLayoutProps) {
   const [showDetails, setShowDetails] = useState(false);

   return (
      <div {...stylex.props(styles.root)}>
         <ChatView
            conversationId={conversationId}
            authUserId={authUserId}
            folder={folder}
            currentFolderHref={currentFolderHref}
            initialMessages={initialMessages}
            initialConversation={initialConversation}
            onInfoClick={() => setShowDetails(v => !v)}
         />
         {showDetails && (
            <ChatDetailsPanel
               conversationId={conversationId}
               authUserId={authUserId}
               initialConversation={initialConversation}
               isGroup={isGroup}
               onClose={() => setShowDetails(false)}
            />
         )}
      </div>
   );
}
