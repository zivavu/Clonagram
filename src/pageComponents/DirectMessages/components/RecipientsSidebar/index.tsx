import 'server-only';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { getNotesForFeed } from '@/src/actions/notes/getNotesForFeed';
import UserAvatar from '@/src/components/UserAvatar';
import CurrentUserName from '@/src/components/Username/CurrentUserName';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { getConversationsQuery } from '@/src/queries/conversations';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { colors } from '../../../../styles/tokens.stylex';
import ConversationList from '../ConversationList';
import NewMessageTrigger from '../NewMessageModal/NewMessageTrigger';
import FriendNoteItem from './FriendNoteItem';
import { styles } from './index.stylex';
import { RequestsContent } from './RequestsContent';
import YourNoteTrigger from './YourNoteTrigger';

export const messageFolders = [
   { key: 'primary', label: 'Primary', href: '/direct' },
   { key: 'general', label: 'General', href: '/direct/general' },
   { key: 'requests', label: 'Requests', href: '/direct/requests' },
] as const;

interface RecipientsSidebarProps {
   currentFolderHref?: string;
   isRequestsPage?: boolean;
   folder: 'primary' | 'general' | 'requests';
}

export default async function RecipientsSidebar({
   currentFolderHref = '/direct',
   isRequestsPage = false,
   folder,
}: RecipientsSidebarProps) {
   const profile = await getAuthProfile();
   const authUserId = profile?.id ?? '';
   const supabase = await createServerClient();
   const [{ data: conversations }, { ownNote, notes: friendNotes }] = await Promise.all([
      getConversationsQuery(supabase, authUserId, folder),
      getNotesForFeed(),
   ]);
   const initialConversations = conversations ?? [];

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

                  <div {...stylex.props(styles.notesRow)}>
                     <div {...stylex.props(styles.noteItem)}>
                        <YourNoteTrigger note={ownNote} />
                        <UserAvatar
                           src={profile?.avatar_url ?? null}
                           alt={profile?.username ?? ''}
                           size={74}
                           username={profile?.username ?? ''}
                           userId={profile?.id}
                           useHoverCard={false}
                        />
                        <span {...stylex.props(styles.noteItemLabel)}>Your note</span>
                     </div>
                     {friendNotes.map(entry => (
                        <FriendNoteItem key={entry.userId} entry={entry} />
                     ))}
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
