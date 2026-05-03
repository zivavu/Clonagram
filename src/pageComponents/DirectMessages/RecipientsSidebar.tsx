import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { colors, radius } from '../../styles/tokens.stylex';
import { CURRENT_USER } from '../Home/data';
import {
   formatTimestamp,
   getLastMessagePreview,
   getThreadDisplayName,
   hasUnreadMessages,
   MESSAGE_THREADS,
} from './messagesData';

const styles = stylex.create({
   recipientsSidebar: {
      width: '480px',
      height: '100dvh',
      borderRightColor: colors.separator,
      borderRightStyle: 'solid',
      borderRightWidth: '1px',
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
      padding: '8px 26px',
      paddingTop: '38px',
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
      borderRadius: '12px',
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
      bottom: '3px',
      left: 0,
      width: '100%',
      height: '1px',
      backgroundColor: colors.separator,
   },
   messageFolderBottomBarActive: {
      backgroundColor: colors.textPrimary,
   },
   searchContainer: {
      position: 'relative',
      width: '100%',
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
      padding: '10px 12px',
      paddingLeft: '48px',
      borderRadius: radius.full,
      backgroundColor: colors.bgSecondary,
      fontSize: '1rem',
      borderWidth: 0,
      outline: 'none',
      '::placeholder': {
         color: colors.textSecondary,
      },
   },
   bodyContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '10px 16px',
      display: 'flex',
      flexDirection: 'column',
   },
   userAvatar: {
      borderRadius: '50%',
   },
   yourNoteSection: {
      display: 'flex',
      flexDirection: 'column',
      width: 'fit-content',
      position: 'relative',
      alignItems: 'center',
      marginTop: '64px',
      marginLeft: '12px',
   },
   yourNoteSpan: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      textAlign: 'center',
   },
   messageBubble: {
      display: 'flex',
      position: 'absolute',
      top: '-34px',
      left: '-12px',
      width: '96px',
      height: '42px',
      backgroundColor: colors.bgBubble,
      color: colors.textSecondary,
      borderRadius: '14px',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.7rem',
      lineHeight: '0.8rem',
   },
   messageBubbleArrow: {
      position: 'absolute',
      bottom: '-4px',
      left: '12px',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: colors.bgBubble,
   },
   messagesList: {
      display: 'flex',
      flexDirection: 'column',
   },
   threadItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px',
      borderRadius: '12px',
      position: 'relative',

      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   threadItemHover: {
      backgroundColor: colors.threadHover,
   },
   threadAvatarContainer: {
      position: 'relative',
      flexShrink: 0,
   },
   threadAvatar: {
      borderRadius: '50%',
      objectFit: 'cover',
   },
   unreadDot: {
      position: 'absolute',
      top: '50%',
      right: '8px',
      transform: 'translateY(-50%)',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: colors.accent,
   },
   threadContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
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
   threadTimestamp: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
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
});

const messageFolders = [
   { label: 'Primary', href: '/direct' },
   { label: 'General', href: '/direct/general' },
   { label: 'Requests', href: '/direct/requests' },
] as const;

const sortedThreads = [...MESSAGE_THREADS].sort(
   (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
);

interface RecipientsSidebarProps {
   pathname: string;
}

export default function RecipientsSidebar({ pathname }: RecipientsSidebarProps) {
   return (
      <div {...stylex.props(styles.recipientsSidebar)}>
         <div {...stylex.props(styles.topBar)}>
            <button {...stylex.props(styles.changeAccountButton)}>
               zivavu
               <BsChevronDown style={{ fontSize: '12px', strokeWidth: '0.4' }} />
            </button>
            <TbEdit style={{ fontSize: '24px', marginLeft: 'auto' }} />
         </div>
         <div {...stylex.props(styles.messageFoldersContainer)}>
            {messageFolders.map(folder => {
               const isActive = folder.href === pathname;
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
               <div {...stylex.props(styles.messageBubble)}>
                  Ask friends anything...
                  <div {...stylex.props(styles.messageBubbleArrow)} />
               </div>
               <span {...stylex.props(styles.yourNoteSpan)}>Your note</span>
            </div>

            <div {...stylex.props(styles.messagesList)}>
               {sortedThreads.map(thread => {
                  const participant = thread.participants[0];
                  const unread = hasUnreadMessages(thread);
                  const isGroup = thread.participants.length > 1;

                  return (
                     <Link key={thread.id} href={`/direct/t/${thread.id}`} {...stylex.props(styles.threadItem)}>
                        <div {...stylex.props(styles.threadAvatarContainer)}>
                           <Image
                              src={participant.avatarUrl}
                              alt={getThreadDisplayName(thread)}
                              width={56}
                              height={56}
                              {...stylex.props(styles.threadAvatar)}
                           />
                        </div>
                        <div {...stylex.props(styles.threadContent)}>
                           <span {...stylex.props(styles.threadName, unread && styles.threadNameUnread)}>
                              {isGroup
                                 ? thread.participants.map(p => p.name || p.username).join(', ')
                                 : participant.name || participant.username}
                           </span>
                           <div {...stylex.props(styles.threadPreviewRow)}>
                              <span {...stylex.props(styles.threadPreview, unread && styles.threadPreviewUnread)}>
                                 {getLastMessagePreview(thread)}
                              </span>
                              <span style={{ color: colors.textSecondary }}>·</span>
                              <span {...stylex.props(styles.threadTimestamp)}>
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
