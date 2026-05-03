import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { MdGridView } from 'react-icons/md';
import { RiMenuFill } from 'react-icons/ri';
import { colors, radius } from '../../styles/tokens.stylex';
import { NavItems } from './NavItems';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      height: '100%',
      width: 'var(--main-sidebar-width)',
      padding: '16px',
      justifyContent: 'space-between',
      backgroundColor: colors.bg,

      paddingBottom: '36px',
      gap: '12px',
      '--label-display': 'none',
      ':hover': {
         width: 'auto',
         '--label-display': 'block',
      },
   },
   nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
   navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      paddingLeft: '8px',
      borderRadius: radius.md,
      color: colors.textPrimary,
      transition: 'background-color 0.15s ease',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   navItemLabel: {
      fontSize: '1rem',
      fontWeight: 400,
      width: '150px',
      textAlign: 'left',
      color: colors.textPrimary,
      display: 'var(--label-display)',
   },
   navItemActive: {
      fontWeight: 600,
   },
});

export type MainSidebarStyles = typeof styles;

export default async function MainSidebar() {
   const headersList = await headers();
   const url = headersList.get('x-url');
   const pathname = url ? new URL(url).pathname : '/';

   return (
      <div {...stylex.props(styles.root)}>
         <Link href="/" {...stylex.props(styles.navItem)} style={{ width: 'fit-content' }}>
            <Image
               src="/clonagram.png"
               alt="Clonagram"
               width={26}
               height={26}
               style={{ filter: 'brightness(0) invert(1)' }}
               loading="eager"
            />
         </Link>

         <nav {...stylex.props(styles.nav)}>
            <NavItems initialPathname={pathname} mainSidebarStyles={styles} />
         </nav>

         <div {...stylex.props(styles.nav)}>
            <button aria-label="More" {...stylex.props(styles.navItem)}>
               <RiMenuFill style={{ fontSize: 28 }} />
               <span {...stylex.props(styles.navItemLabel)}>More</span>
            </button>
            <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
               <MdGridView style={{ fontSize: 28 }} />
               <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
            </button>
         </div>
      </div>
   );
}
