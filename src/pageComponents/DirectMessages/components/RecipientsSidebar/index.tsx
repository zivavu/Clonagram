import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import { createServerClient } from '@/src/lib/supabase/server';
import { hasUnreadMessages } from '@/src/utils/messages';
import Username from '../../../../components/Username';
import NewMessageTrigger from '../NewMessageModal/NewMessageTrigger';
import { messageFolders, sortedThreads, styles } from './index.stylex';
import { RequestsContent } from './RequestsContent';
import { ThreadItem } from './ThreadItem';

interface RecipientsSidebarProps {
   currentFolderHref?: string;
   isRequestsPage?: boolean;
}

export default async function RecipientsSidebar({
   currentFolderHref = '/direct',
   isRequestsPage = false,
}: RecipientsSidebarProps) {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', user?.id ?? '')
      .single();
   const currentUserId = profile?.id ?? user?.id ?? '';
   const currentFolderKey = messageFolders.find(folder => folder.href === currentFolderHref)?.key;

   return (
      <div {...stylex.props(styles.root)}>
         {!isRequestsPage && (
            <>
               <div {...stylex.props(styles.topBar)}>
                  <button {...stylex.props(styles.changeAccountButton)}>
                     <Username />
                     <BsChevronDown style={{ fontSize: '12px', strokeWidth: '0.4' }} />
                  </button>
                  <NewMessageTrigger>
                     <TbEdit style={{ fontSize: '24px' }} />
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
                     />
                     <div {...stylex.props(styles.messageBubble)}>Ask friends anything...</div>
                     <span {...stylex.props(styles.yourNoteSpan)}>Your note</span>
                  </div>

                  <div {...stylex.props(styles.messagesList)}>
                     {sortedThreads
                        .filter(e => e.folder === currentFolderKey)
                        .map(thread => (
                           <ThreadItem
                              key={thread.id}
                              thread={thread}
                              href={`${currentFolderHref}/${thread.id}`}
                              unread={hasUnreadMessages(thread, currentUserId)}
                              currentUserId={currentUserId}
                           />
                        ))}
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
