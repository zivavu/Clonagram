'use client';

import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { styles } from './index.stylex';

export default function SwitchButton() {
   const router = useRouter();

   async function handleSwitch() {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.push('/login');
   }

   return (
      <button type="button" onClick={handleSwitch} {...stylex.props(styles.switchLink)}>
         Logout
      </button>
   );
}
