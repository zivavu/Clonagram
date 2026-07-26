import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { getCachedUser } from '@/src/lib/supabase/getCachedUser';
import { AlsoFromZetaPopover } from './AlsoFromZetaPopover';
import { styles } from './index.stylex';
import { NavItems } from './NavItems';
import { SettingsPopoverButton } from './SettingsPopover';

export default async function MainNavbar() {
   const [profile, user] = await Promise.all([getAuthProfile(), getCachedUser()]);
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
            <SettingsPopoverButton
               hideAiContent={profile?.hide_ai_content ?? false}
               isAnonymous={isAnonymous}
            />
            <AlsoFromZetaPopover mainSidebarStyles={styles} />
         </div>
      </div>
   );
}
