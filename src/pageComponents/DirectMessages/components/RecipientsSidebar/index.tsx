import 'server-only';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import CurrentUserName from '@/src/components/Username/CurrentUserName';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import type { ConversationSummaries } from '@/src/queries/conversations';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { colors } from '../../../../styles/tokens.stylex';
import ConversationList from '../ConversationList';
import NewMessageTrigger from '../NewMessageModal/NewMessageTrigger';
import { styles } from './index.stylex';
import { RequestsContent } from './RequestsContent';

export const messageFolders = [
   { key: 'primary', label: 'Primary', href: '/direct' },
   { key: 'general', label: 'General', href: '/direct/general' },
   { key: 'requests', label: 'Requests', href: '/direct/requests' },
] as const;

interface RecipientsSidebarProps {
   currentFolderHref?: string;
   isRequestsPage?: boolean;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   initialConversations: ConversationSummaries;
}

export default async function RecipientsSidebar({
   currentFolderHref = '/direct',
   isRequestsPage = false,
   authUserId,
   folder,
   initialConversations,
}: RecipientsSidebarProps) {
   const profile = await getAuthProfile();

   return (
      <div {...stylex.props(styles.root)}>
         {!isRequestsPage && (
            <>
               <div {...stylex.props(styles.topBar)}>
                  <button {...stylex.props(styles.changeAccountButton)}>
                     <CurrentUserName />
                     <BsChevronDown style={{ fontSize: '12px', strokeWidth: '0.4' }} />
                  </button>
                  <NewMessageTrigger>
                     <TbEdit style={{ fontSize: '24px', color: colors.textPrimary }} />
                  </NewMessageTrigger>
               </div>

               <div {...stylex.props(styles.messageFoldersContainer)}>
                  {messageFolders.map(f => {
                     const isActive = f.href === currentFolderHref;
                     return (
                        <Link
                           key={f.key}
                           href={f.href}
                           {...stylex.props(
                              styles.messageFolderLink,
                              isActive && styles.messageFolderActive,
                           )}
                        >
                           {f.label}
                           <div
                              {...stylex.props(
                                 styles.messageFolderBottomBar,
                                 isActive && styles.messageFolderBottomBarActive,
                              )}
                           />
                        </Link>
                     );
                  })}
               </div>
            </>
         )}
         <div {...stylex.props(styles.bodyContainer)}>
            {isRequestsPage && (
               <RequestsContent authUserId={authUserId} initialData={initialConversations} />
            )}
            {!isRequestsPage && (
               <>
                  <div {...stylex.props(styles.searchContainer)}>
                     <BsSearch {...stylex.props(styles.searchIcon)} />
                     <input
                        {...stylex.props(styles.searchInput, sharedStyles.placeholder)}
                        type="text"
                        placeholder="Search"
                     />
                  </div>

                  <div {...stylex.props(styles.yourNoteSection)}>
                     <UserAvatar
                        src={profile?.avatar_url ?? null}
                        alt={profile?.username ?? ''}
                        size={74}
                        username={profile?.username ?? ''}
                        userId={profile?.id}
                        useHoverCard={false}
                     />
                     <div {...stylex.props(styles.messageBubble)}>Ask friends anything...</div>
                     <span {...stylex.props(styles.yourNoteSpan)}>Your note</span>
                  </div>

                  <div {...stylex.props(styles.messagesList)}>
                     <ConversationList
                        authUserId={authUserId}
                        folder={folder}
                        currentFolderHref={currentFolderHref}
                        initialData={initialConversations}
                     />
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
