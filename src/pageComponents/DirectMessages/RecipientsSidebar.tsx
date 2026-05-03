import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { colors, radius } from '../../styles/tokens.stylex';
import { CURRENT_USER } from '../Home/data';

const styles = stylex.create({
   recipientsSidebar: {
      width: '480px',
      height: '100dvh',
      borderRightColor: colors.separator,
      borderRightStyle: 'solid',
      borderRightWidth: '1px',
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
   },
   recipientsContainer: {
      padding: '10px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '64px',
   },
   userAvatar: {
      borderRadius: '50%',
   },
   recipientsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '0px 12px',
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
      fontSize: '0.7rem',
      lineHeight: '0.8rem',

      '::before': {
         content: '""',
         position: 'absolute',
         bottom: '-4px',
         left: '12px',
         width: '10px',
         height: '10px',
         borderRadius: '50%',
         zIndex: 5,
         backgroundColor: colors.bgBubble,
      },
   },
});

const messageFolders = [
   { label: 'Primary', href: '/direct' },
   { label: 'General', href: '/direct/general' },
   { label: 'Requests', href: '/direct/requests' },
] as const;

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
                     ></div>
                  </Link>
               );
            })}
         </div>
         <div {...stylex.props(styles.recipientsContainer)}>
            <div {...stylex.props(styles.searchContainer)}>
               <BsSearch {...stylex.props(styles.searchIcon)} />
               <input {...stylex.props(styles.searchInput)} type="text" placeholder="Search" />
            </div>

            <div {...stylex.props(styles.recipientsList)}>
               <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', position: 'relative' }}>
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
            </div>
         </div>
      </div>
   );
}
