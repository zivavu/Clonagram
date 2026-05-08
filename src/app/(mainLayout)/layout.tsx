import * as stylex from '@stylexjs/stylex';
import MainSidebar from '@/src/components/MainSidebar';
import { styles } from './layout.stylex';

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div {...stylex.props(styles.root)}>
         <MainSidebar />
         {children}
      </div>
   );
}
