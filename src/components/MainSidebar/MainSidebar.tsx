import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { MdGridView, MdMenu } from 'react-icons/md';
import { colors, radius } from '../../styles/tokens.stylex';
import { NavItems } from './NavItems';

const styles = stylex.create({
   root: {
      height: '100svh',
      position: 'sticky',
      zIndex: 1,
   },
   leftSidebarContent: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      height: '100%',
      padding: '16px',
      minWidth: 'max-content',
      justifyContent: 'space-between',
      backgroundColor: colors.bg,

      paddingBottom: '36px',
      gap: '12px',
      '--label-display': 'none',
      ':hover': {
         '--label-display': 'block',
         width: '100%',
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
      padding: '12px 8px',
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
      width: '180px',
      textAlign: 'left',
      color: colors.textPrimary,
      display: 'var(--label-display)',
   },
});

const passthroughPrefixes = ['/stories'];

export default async function MainSidebar() {
   const headersList = await headers();
   const url = headersList.get('x-url');
   const pathname = url ? new URL(url).pathname : '/';

   if (passthroughPrefixes.some(p => pathname.startsWith(p))) {
      return null;
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.leftSidebarContent)}>
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
               <NavItems initialPathname={pathname} />
            </nav>

            <div {...stylex.props(styles.nav)}>
               <button aria-label="More" {...stylex.props(styles.navItem)}>
                  <MdMenu style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)}>More</span>
               </button>
               <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
                  <MdGridView style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
               </button>
            </div>
         </div>
      </div>
   );
}
