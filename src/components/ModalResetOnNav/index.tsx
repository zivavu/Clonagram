'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useNotificationsPortalStore } from '../../store/createModalStore';
import { useOwnerActionsModal } from '../../store/useOwnerActionsModalStore';
import { usePostViewModal } from '../../store/usePostViewModalStore';

const POST_URL_PATTERN = /^\/profile\/[^/]+\/[^/]+$/;

export default function ModalResetOnNav() {
   const pathname = usePathname();
   const closePostViewModal = usePostViewModal(state => state.close);
   const closeOwnerActionsModal = useOwnerActionsModal(state => state.close);
   const closeNotificationsModal = useNotificationsPortalStore(state => state.close);

   // biome-ignore lint/correctness/useExhaustiveDependencies: The pathname dependency is intentional.
   useEffect(() => {
      closeNotificationsModal();
   }, [pathname, closeNotificationsModal]);

   useEffect(() => {
      if (POST_URL_PATTERN.test(pathname)) return;
      closePostViewModal();
      closeOwnerActionsModal();
      closeNotificationsModal();
   }, [pathname, closePostViewModal, closeOwnerActionsModal, closeNotificationsModal]);

   useEffect(() => {
      function onPopState() {
         const isPostUrl = POST_URL_PATTERN.test(window.location.pathname);
         const isOpen = usePostViewModal.getState().isOpen;
         if (!isPostUrl && isOpen) {
            closePostViewModal();
         }
      }
      window.addEventListener('popstate', onPopState);
      return () => window.removeEventListener('popstate', onPopState);
   }, [closePostViewModal]);

   return null;
}
