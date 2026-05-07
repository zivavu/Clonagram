import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import MainSidebar from '@/src/components/MainSidebar/MainSidebar';
import { styles } from './layout.stylex';

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   const headersList = await headers();
   const url = headersList.get('x-url');
   const pathname = url ? new URL(url, 'http://localhost').pathname : '/';

   return (
      <div {...stylex.props(styles.root)}>
         <MainSidebar pathname={pathname} />
         {children}
      </div>
   );
}
