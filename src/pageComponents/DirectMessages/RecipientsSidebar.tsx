import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { colors, radius } from '../../styles/tokens.stylex';

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
      fontSize: '1rem',
      borderWidth: 0,
   },
   recipientsContainer: {
      padding: '10px 16px',
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
         </div>
      </div>
   );
}
