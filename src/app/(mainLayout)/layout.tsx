import * as stylex from '@stylexjs/stylex';
import CreatePostModal from '@/src/components/CreatePostModal';
import CreateStoryModal from '@/src/components/CreateStoryModal';
import MainSidebar from '@/src/components/MainSidebar';
import ModalResetOnNav from '@/src/components/ModalResetOnNav';
import NotificationsPortal from '@/src/components/NotificationsPortal';
import OwnerActionsModal from '@/src/components/OwnerActionsModal/OwnerActionsModal';
import PostFullViewModal from '@/src/components/PostViewModal';
import SearchPortal from '@/src/components/SearchPortal';
import { styles } from './layout.stylex';

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div {...stylex.props(styles.root)}>
         <ModalResetOnNav />

         <MainSidebar />
         <PostFullViewModal />
         <OwnerActionsModal />
         <CreatePostModal />
         <CreateStoryModal />
         <SearchPortal />
         <NotificationsPortal />
         {children}
      </div>
   );
}
