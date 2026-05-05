import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoChevronForward, IoEyeOffOutline } from 'react-icons/io5';
import { TbEdit } from 'react-icons/tb';
import { colors, radius } from '../../styles/tokens.stylex';
import { CURRENT_USER } from '../Home/data';
import {
   formatTimestamp,
   getLastMessagePreview,
   getRequestThreads,
   hasUnreadMessages,
   MESSAGE_THREADS,
   type MessageThread,
} from './messagesData';

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
   requestsHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 16px',
   },
   backButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      color: colors.textPrimary,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: '30px',
      color: colors.textPrimary,
   },
   infoBanner: {
      padding: '24px 24px',
      paddingTop: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 16,
   },
   infoText: {
      fontSize: 12,
      color: colors.textSecondary,
      margin: 0,
   },
   infoLink: {
      fontSize: 12,
      fontWeight: 600,
      color: colors.accentTextHover,
      textDecoration: 'none',
      cursor: 'pointer',
   },
   requestsBody: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
   },
   hiddenRequestsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 24px',
      cursor: 'pointer',
      minHeight: 72,
      width: '100%',
      border: 'none',
      background: 'none',
      textAlign: 'left',
      color: 'inherit',
      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   hiddenRequestsAvatar: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      backgroundColor: colors.separator,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
   },
   hiddenRequestsLabel: {
      flex: 1,
      fontSize: 14,
      lineHeight: '18px',
      color: colors.textPrimary,
   },

   bottomSection: {
      borderTopWidth: 1,
      paddingTop: 8,
      borderTopStyle: 'solid',
      borderTopColor: colors.separator,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   deleteAllButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 0',
      fontSize: 16,
      lineHeight: '20px',
      color: colors.danger,
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
   { key: 'primary', label: 'Primary', href: '/direct' },
   { key: 'general', label: 'General', href: '/direct/general' },
   { key: 'requests', label: 'Requests', href: '/direct/requests' },
] as const;

const sortedThreads = [...MESSAGE_THREADS].sort(
   (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
);

function ThreadItem({
   thread,
   href,
   unread,
}: {
   thread: MessageThread;
   href: string;
   showChevron?: boolean;
   unread?: boolean;
}) {
   const participant = thread.participants[0];
   const displayName = participant.name || participant.username;

   return (
      <Link key={thread.id} href={href} {...stylex.props(styles.threadItem)}>
         <Image
            src={participant.avatarUrl}
            alt={displayName}
            width={56}
            height={56}
            {...stylex.props(styles.threadAvatar)}
         />
         <div {...stylex.props(styles.threadContent)}>
            <span {...stylex.props(styles.threadName, unread && styles.threadNameUnread)}>{displayName}</span>
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
}

function RequestsContent() {
   const requestThreads = getRequestThreads();

   return (
      <>
         <div {...stylex.props(styles.requestsHeader)}>
            <Link href="/direct" {...stylex.props(styles.backButton)} aria-label="Back to messages" role="button">
               <FaArrowLeft size={24} />
            </Link>
            <span {...stylex.props(styles.headerTitle)}>Message requests</span>
         </div>

         <div {...stylex.props(styles.infoBanner)}>
            <p {...stylex.props(styles.infoText)}>
               Open a chat to get more info about who&apos;s messaging you. They won&apos;t know you&apos;ve seen it
               until you accept.
            </p>
            <a {...stylex.props(styles.infoLink)} href="/accounts/privacy_and_security/">
               Decide who can message you
            </a>
         </div>

         <div {...stylex.props(styles.requestsBody)}>
            <button {...stylex.props(styles.hiddenRequestsRow)} aria-label="Hidden Requests">
               <div {...stylex.props(styles.hiddenRequestsAvatar)}>
                  <IoEyeOffOutline size={22} />
               </div>
               <span {...stylex.props(styles.hiddenRequestsLabel)}>Hidden Requests</span>
               <IoChevronForward size={16} />
            </button>

            {requestThreads.map(thread => (
               <ThreadItem key={thread.id} thread={thread} href={`/direct/requests/${thread.id}`} showChevron />
            ))}
         </div>

         <div {...stylex.props(styles.bottomSection)}>
            <button {...stylex.props(styles.deleteAllButton)}>Delete all {requestThreads.length}</button>
         </div>
      </>
   );
}

export default async function RecipientsSidebar() {
   const headersList = await headers();
   const pathname = new URL(headersList.get('x-url') || '/').pathname;

   const currentFolderHref =
      messageFolders.findLast(({ href }) => pathname === href || pathname.startsWith(`${href}/`))?.href ?? '/direct';
   const currentFolderKey = messageFolders.find(folder => folder.href === currentFolderHref)?.key;
   const isRequestsPage = currentFolderKey === 'requests';

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
