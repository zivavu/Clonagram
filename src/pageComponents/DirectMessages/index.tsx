import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import Link from 'next/link';
import { BsChevronDown } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: 'var(--main-sidebar-width)',
   },
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
   messagesFoldersContainer: {
      display: 'flex',
      width: '100%',
   },
   messagesFolderLink: {
      position: 'relative',
      width: '100%',
      padding: '14px 12px',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: colors.textSecondary,
      textAlign: 'center',
   },
   messagesFolderActive: {
      color: colors.textPrimary,
   },
   messagesFolderBottomBar: {
      position: 'absolute',
      bottom: '3px',
      left: 0,
      width: '100%',
      height: '1px',
      backgroundColor: colors.separator,
   },
   messagesFolderBottomBarActive: {
      backgroundColor: colors.textPrimary,
   },
});

const messagesFolders = [
   { label: 'Primary', href: '/direct' },
   { label: 'General', href: '/direct/general' },
   { label: 'Requests', href: '/direct/requests' },
] as const;

export default async function DirectMessagesPage() {
   const headersList = await headers();
   const url = headersList.get('x-url');
   const pathname = new URL(url || '/').pathname;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.recipientsSidebar)}>
            <div {...stylex.props(styles.topBar)}>
               <button {...stylex.props(styles.changeAccountButton)}>
                  zivavu
                  <BsChevronDown style={{ fontSize: '12px', strokeWidth: '0.4' }} />
               </button>
               <TbEdit style={{ fontSize: '24px', marginLeft: 'auto' }} />
            </div>
            <div {...stylex.props(styles.messagesFoldersContainer)}>
               {messagesFolders.map(folder => {
                  const isActive = folder.href === pathname;
                  return (
                     <Link
                        key={folder.label}
                        href={folder.href}
                        {...stylex.props(styles.messagesFolderLink, isActive && styles.messagesFolderActive)}
                     >
                        {folder.label}
                        <div
                           {...stylex.props(
                              styles.messagesFolderBottomBar,
                              isActive && styles.messagesFolderBottomBarActive,
                           )}
                        ></div>
                     </Link>
                  );
               })}
            </div>
         </div>
      </div>
   );
}
