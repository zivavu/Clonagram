import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { hasUnreadMessages } from '@/src/utils/messages';
import CurrentUserName from '../../../../components/Username/CurrentUserName';
import { colors } from '../../../../styles/tokens.stylex';
import { MESSAGE_THREADS } from '../../../mocks/messageThreads';
import NewMessageTrigger from '../NewMessageModal/NewMessageTrigger';
import { styles } from './index.stylex';
import { RequestsContent } from './RequestsContent';
import { ThreadItem } from './ThreadItem';

export const messageFolders = [
   { key: 'primary', label: 'Primary', href: '/direct' },
   { key: 'general', label: 'General', href: '/direct/general' },
   { key: 'requests', label: 'Requests', href: '/direct/requests' },
] as const;

export const sortedThreads = MESSAGE_THREADS.sort(
   (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
);

interface RecipientsSidebarProps {
   currentFolderHref?: string;
   isRequestsPage?: boolean;
}

export default async function RecipientsSidebar({
   currentFolderHref = '/direct',
   isRequestsPage = false,
}: RecipientsSidebarProps) {
   const profile = await getAuthProfile();
   const currentUserId = profile?.id ?? '';
   const currentFolderKey = messageFolders.find(folder => folder.href === currentFolderHref)?.key;

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
                  {messageFolders.map(folder => {
                     const isActive = folder.href === currentFolderHref;
                     return (
                        <Link
                           key={folder.key}
                           href={folder.href}
                           {...stylex.props(
                              styles.messageFolderLink,
                              isActive && styles.messageFolderActive,
                           )}
                        >
                           {folder.label}
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
            {isRequestsPage && <RequestsContent />}
            {!isRequestsPage && (
               <>
                  <div {...stylex.props(styles.searchContainer)}>
                     <BsSearch {...stylex.props(styles.searchIcon)} />
                     <input
                        {...stylex.props(styles.searchInput)}
                        type="text"
                        placeholder="Search"
                     />
                  </div>

                  <div {...stylex.props(styles.yourNoteSection)}>
                     <UserAvatar
                        src={profile?.avatar_url ?? null}
                        alt={profile?.username ?? ''}
                        size={74}
                        userId={profile?.id}
                     />
                     <div {...stylex.props(styles.messageBubble)}>Ask friends anything...</div>
                     <span {...stylex.props(styles.yourNoteSpan)}>Your note</span>
                  </div>

                  <div {...stylex.props(styles.messagesList)}>
                     {sortedThreads.length > 0 ? (
                        sortedThreads
                           .filter(e => e.folder === currentFolderKey)
                           .map(thread => (
                              <ThreadItem
                                 key={thread.id}
                                 thread={thread}
                                 href={`${currentFolderHref}/${thread.id}`}
                                 unread={hasUnreadMessages(thread, currentUserId)}
                                 currentUserId={currentUserId}
                              />
                           ))
                     ) : (
                        <span style={{ color: colors.textSecondary, padding: '16px 32px' }}>
                           Chats will appear here after you send or receive a message
                        </span>
                     )}
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
