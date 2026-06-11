import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { MdGridView } from 'react-icons/md';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { SettingsPopoverButton } from '../SettingsPopover';
import { styles } from './index.stylex';
import { NavItems } from './NavItems';

export default async function MainNavbar() {
   const supabase = await createServerClient();
   const profile = await getAuthProfile(supabase);
   const {
      data: { user },
   } = await supabase.auth.getUser();
   const isAnonymous = user?.is_anonymous ?? false;

   return (
      <div {...stylex.props(styles.root)}>
         <Link
            href="/"
            {...stylex.props(styles.logo, styles.navItem)}
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
            <NavItems mainSidebarStyles={styles} profile={profile} isAnonymous={isAnonymous} />
         </nav>

         <div {...stylex.props(styles.bottomSection)}>
            <SettingsPopoverButton />
            <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
               <MdGridView size={28} />
               <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
            </button>
         </div>
      </div>
   );
}
