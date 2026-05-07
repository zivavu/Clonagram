import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { MdGridView } from 'react-icons/md';
import { RiMenuFill } from 'react-icons/ri';
import { styles } from './MainSidebar.stylex';
import { NavItems } from './NavItems';

interface MainSidebarProps {
   pathname: string;
}

export default async function MainSidebar({ pathname }: MainSidebarProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <Link href="/" {...stylex.props(styles.navItem)} style={{ width: 'fit-content', padding: '8px' }}>
            <Image
               src="/clonagram.png"
               alt="Clonagram"
               width={22}
               height={22}
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
