import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { CURRENT_USER } from '../../Home/data';
import { hasUnreadMessages, isRequestsFolder } from '../messagesData';
import { RequestsContent } from './RequestsContent';
import { messageFolders, sortedThreads, styles } from './styles';
import { ThreadItem } from './ThreadItem';

export default async function RecipientsSidebar() {
   const headersList = await headers();
   const pathname = new URL(headersList.get('x-url') || '/').pathname;

   const currentFolderHref =
      messageFolders.findLast(({ href }) => pathname === href || pathname.startsWith(`${href}/`))?.href ?? '/direct';
   const currentFolderKey = messageFolders.find(folder => folder.href === currentFolderHref)?.key;
   const isRequestsPage = await isRequestsFolder();

   return (
      <div {...stylex.props(styles.root)}>
         {!isRequestsPage && (
            <>
               <div {...stylex.props(styles.topBar)}>
                  <button {...stylex.props(styles.changeAccountButton)}>
                     zivavu
                     <BsChevronDown style={{ fontSize: '12px', strokeWidth: '0.4' }} />
                  </button>
                  <TbEdit style={{ fontSize: '24px', marginLeft: 'auto' }} />
               </div>

               <div {...stylex.props(styles.messageFoldersContainer)}>
                  {messageFolders.map(folder => {
                     const isActive = folder.href === currentFolderHref;
                     return (
                        <Link
                           key={folder.key}
                           href={folder.href}
                           {...stylex.props(styles.messageFolderLink, isActive && styles.messageFolderActive)}
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
                     <input {...stylex.props(styles.searchInput)} type="text" placeholder="Search" />
                  </div>

                  <div {...stylex.props(styles.yourNoteSection)}>
                     <Image
                        src={CURRENT_USER.avatarUrl}
                        alt={CURRENT_USER.username}
                        width={74}
                        height={74}
                        {...stylex.props(styles.userAvatar)}
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
                              unread={hasUnreadMessages(thread)}
                           />
                        ))}
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
