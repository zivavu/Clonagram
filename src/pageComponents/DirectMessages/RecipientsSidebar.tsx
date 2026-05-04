import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { colors, radius } from '../../styles/tokens.stylex';
import { CURRENT_USER } from '../Home/data';
import { formatTimestamp, getLastMessagePreview, hasUnreadMessages, MESSAGE_THREADS } from './messagesData';

const styles = stylex.create({
   root: {
      minWidth: '480px',
      height: '100dvh',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: colors.separator,
      display: 'flex',
      flexDirection: 'column',
   },
   changeAccountButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '1.2rem',
      fontWeight: '700',
   },
   topBar: {
      padding: '38px 26px 8px',
      display: 'flex',
      alignItems: 'center',
   },
   messageFoldersContainer: {
      display: 'flex',
      width: '100%',
   },
   messageFolderLink: {
      position: 'relative',
      width: '100%',
      padding: '14px 12px',
      borderRadius: radius.md,
      fontSize: '0.9rem',
      fontWeight: 600,
      color: colors.textSecondary,
      textAlign: 'center',
      textDecoration: 'none',
   },
   messageFolderActive: {
      color: colors.textPrimary,
   },
   messageFolderBottomBar: {
      position: 'absolute',
      bottom: 3,
      left: 0,
      width: '100%',
      height: 1,
      backgroundColor: colors.separator,
   },
   messageFolderBottomBarActive: {
      backgroundColor: colors.textPrimary,
   },
   bodyContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '10px 0',
      display: 'flex',
      flexDirection: 'column',
   },
   searchContainer: {
      position: 'relative',
      margin: '0 16px',
   },
   searchIcon: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '0.9rem',
      color: colors.textSecondary,
      pointerEvents: 'none',
   },
   searchInput: {
      width: '100%',
      padding: '10px 12px 10px 48px',
      borderRadius: radius.full,
      backgroundColor: colors.bgSecondary,
      fontSize: '1rem',
      borderWidth: 0,
      outline: 'none',
      '::placeholder': {
         color: colors.textSecondary,
      },
   },

   yourNoteSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      width: 'fit-content',
      margin: '64px 0 0 28px',
   },
   userAvatar: {
      borderRadius: '50%',
   },
   yourNoteSpan: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
   messageBubble: {
      position: 'absolute',
      top: -34,
      left: -6,
      padding: '8px 12px',
      backgroundColor: colors.bgBubble,
      color: colors.textSecondary,
      borderRadius: 14,
      fontSize: '0.7rem',
      lineHeight: '0.8rem',
      textAlign: 'center',
      '::after': {
         content: '',
         position: 'absolute',
         bottom: -4,
         left: 14,
         width: 10,
         height: 10,
         borderRadius: '50%',
         backgroundColor: colors.bgBubble,
      },
   },
   messagesList: {
      display: 'flex',
      flexDirection: 'column',
   },
   threadItem: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      gap: 12,
      padding: '8px 24px',
      borderRadius: radius.md,
      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   threadAvatar: {
      borderRadius: '50%',
      objectFit: 'cover',
   },
   unreadDot: {
      position: 'absolute',
      top: '50%',
      right: 24,
      transform: 'translateY(-50%)',
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: colors.accent,
   },
   threadContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
   },
   threadPreviewRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
   },
   threadName: {
      fontSize: '0.85rem',
      fontWeight: 300,
      color: colors.textPrimary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
   },
   threadNameUnread: {
      fontWeight: 600,
   },
   threadPreview: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
   },
   threadPreviewUnread: {
      color: colors.textPrimary,
      fontWeight: 600,
   },
   threadTimestamp: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
});

const messageFolders = [
   { label: 'Primary', href: '/direct' },
   { label: 'General', href: '/direct/general' },
   { label: 'Requests', href: '/direct/requests' },
] as const;

const sortedThreads = [...MESSAGE_THREADS].sort(
   (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
);

export default async function RecipientsSidebar() {
   const headersList = await headers();
   const pathname = new URL(headersList.get('x-url') || '/').pathname;

   const currentFolder =
      pathname.startsWith('/direct/general/') || pathname === '/direct/general'
         ? '/direct/general'
         : pathname.startsWith('/direct/requests/') || pathname === '/direct/requests'
           ? '/direct/requests'
           : '/direct';

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.topBar)}>
            <button {...stylex.props(styles.changeAccountButton)}>
               zivavu
               <BsChevronDown style={{ fontSize: '12px', strokeWidth: '0.4' }} />
            </button>
            <TbEdit style={{ fontSize: '24px', marginLeft: 'auto' }} />
         </div>

         <div {...stylex.props(styles.messageFoldersContainer)}>
            {messageFolders.map(folder => {
               const isActive = folder.href === currentFolder;
               return (
                  <Link
                     key={folder.label}
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

         <div {...stylex.props(styles.bodyContainer)}>
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
               {sortedThreads.map(thread => {
                  const participant = thread.participants[0];
                  const displayName = participant.name || participant.username;
                  const unread = hasUnreadMessages(thread);

                  return (
                     <Link key={thread.id} href={`${currentFolder}/${thread.id}`} {...stylex.props(styles.threadItem)}>
                        <Image
                           src={participant.avatarUrl}
                           alt={displayName}
                           width={56}
                           height={56}
                           {...stylex.props(styles.threadAvatar)}
                        />
                        <div {...stylex.props(styles.threadContent)}>
                           <span {...stylex.props(styles.threadName, unread && styles.threadNameUnread)}>
                              {displayName}
                           </span>
                           <div {...stylex.props(styles.threadPreviewRow)}>
                              <span {...stylex.props(styles.threadPreview, unread && styles.threadPreviewUnread)}>
                                 {getLastMessagePreview(thread)}
                              </span>
                              <span {...stylex.props(styles.threadTimestamp)}>
                                 {' · '}
                                 {formatTimestamp(thread.lastMessageAt)}
                              </span>
                           </div>
                        </div>
                        {unread && <div {...stylex.props(styles.unreadDot)} />}
                     </Link>
                  );
               })}
            </div>
         </div>
      </div>
   );
}
