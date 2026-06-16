import * as stylex from '@stylexjs/stylex';
import { Suspense } from 'react';
import CreatePostModal from '@/src/components/CreatePostModal';
import CreateStoryModal from '@/src/components/CreateStoryModal';
import IncomingCallListener from '@/src/components/IncomingCallListener';
import MainNavbar from '@/src/components/MainNavbar';
import ModalResetOnNav from '@/src/components/ModalResetOnNav';
import NewNoteModalWrapper from '@/src/components/NewNoteModal/NewNoteModalWrapper';
import NotificationsPortal from '@/src/components/NotificationsPortal';
import OwnerActionsModal from '@/src/components/OwnerActionsModal';
import PostFullViewModal from '@/src/components/PostViewModal';
import SearchPortal from '@/src/components/SearchPortal';
import SharePostModal from '@/src/components/SharePostModal';
import ShareStoryModal from '@/src/components/ShareStoryModal';
import { styles } from './layout.stylex';

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div {...stylex.props(styles.root)}>
         <ModalResetOnNav />

         <MainNavbar />
         <PostFullViewModal />
         <OwnerActionsModal />
         <SharePostModal />
         <ShareStoryModal />
         <CreatePostModal />
         <CreateStoryModal />
         <Suspense>
            <NewNoteModalWrapper />
         </Suspense>
         <SearchPortal />
         <NotificationsPortal />
         <IncomingCallListener />
         {children}
      </div>
   );
}
