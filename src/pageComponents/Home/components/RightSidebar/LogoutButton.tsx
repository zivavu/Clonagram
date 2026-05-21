'use client';

import * as stylex from '@stylexjs/stylex';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { styles } from './index.stylex';

export default function LogoutButton() {
   const router = useRouter();
   const querryClient = useQueryClient();

   async function handleLogout() {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.push('/login');
      querryClient.invalidateQueries();
   }

   return (
      <button type="button" onClick={handleLogout} {...stylex.props(styles.switchLink)}>
         Logout
      </button>
   );
}
