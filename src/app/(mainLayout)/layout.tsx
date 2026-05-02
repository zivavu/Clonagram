import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import MainSidebar from '@/src/components/MainSidebar/MainSidebar';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      backgroundColor: colors.bg,
   },
});

const disableSidebarPages = ['/stories'];

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   const headersList = await headers();
   const url = headersList.get('x-url');
   const showSidebar = !disableSidebarPages.some(el => new URL(url ?? '').pathname.startsWith(el));

   return (
      <div {...stylex.props(styles.root)}>
         {showSidebar && <MainSidebar url={url} />}
         {children}
      </div>
   );
}
