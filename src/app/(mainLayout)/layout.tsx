import * as stylex from '@stylexjs/stylex';
import MainSidebar from '@/src/components/MainSidebar';
import ModalResetOnNav from '@/src/components/ModalResetOnNav';
import OwnerActionsModal from '@/src/components/OwnerActionsModal/OwnerActionsModal';
import PostFullViewModal from '@/src/components/PostViewModal';
import { styles } from './layout.stylex';

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div {...stylex.props(styles.root)}>
         <MainSidebar />
         <ModalResetOnNav />
         <PostFullViewModal />
         <OwnerActionsModal />
         {children}
      </div>
   );
}
