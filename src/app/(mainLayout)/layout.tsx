import * as stylex from '@stylexjs/stylex';
import MainSidebar from '@/src/components/MainSidebar/MainSidebar';
import { createClient } from '@/src/lib/supabase/server';
import { styles } from './layout.stylex';

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   return (
      <div {...stylex.props(styles.root)}>
         <MainSidebar />
         {children}
      </div>
   );
}
