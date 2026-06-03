import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { MdGridView } from 'react-icons/md';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { SettingsPopoverButton } from '../SettingsPopover';
import { styles } from './index.stylex';
import { NavItems } from './NavItems';

export default async function MainSidebar() {
   const profile = await getAuthProfile();

   return (
      <div {...stylex.props(styles.root)}>
         <Link
            href="/"
            {...stylex.props(styles.navItem)}
            style={{ width: 'fit-content', padding: '8px' }}
         >
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
            <NavItems mainSidebarStyles={styles} profile={profile} />
         </nav>

         <div {...stylex.props(styles.nav)}>
            <SettingsPopoverButton />
            <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
               <MdGridView style={{ fontSize: 28 }} />
               <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
            </button>
         </div>
      </div>
   );
}
