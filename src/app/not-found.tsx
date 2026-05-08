import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import AuthPagesFooter from '@/src/components/AuthPagesFooter';
import MainSidebar from '../components/MainSidebar';
import { createClient } from '../lib/supabase/server';
import { styles } from './not-found.stylex';

export default async function NotFound() {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   return (
      <div {...stylex.props(styles.page)}>
         {user && <MainSidebar />}
         <main {...stylex.props(styles.main)}>
            <h1 {...stylex.props(styles.heading)}>Sorry, this page isn&apos;t available.</h1>
            <p {...stylex.props(styles.message)}>
               The link you followed may be broken, or the page may have been removed.{' '}
               <Link href="/" {...stylex.props(styles.link)}>
                  Go back to Clonagram.
               </Link>
            </p>
         </main>
         <AuthPagesFooter style={{ borderTopStyle: 'none' }} />
      </div>
   );
}
