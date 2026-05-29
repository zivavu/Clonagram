'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { usePostViewModal } from '../../store/postViewModalStore';
import { useOwnerActionsModal } from '../../store/useOwnerActionsModalStore';

const POST_URL_PATTERN = /^\/profile\/[^/]+\/[^/]+$/;

export default function ModalResetOnNav() {
   const pathname = usePathname();
   const closePostViewModal = usePostViewModal(state => state.close);
   const closeOwnerActionsModal = useOwnerActionsModal(state => state.close);

   useEffect(() => {
      if (POST_URL_PATTERN.test(pathname)) return;
      closePostViewModal();
      closeOwnerActionsModal();
   }, [pathname, closePostViewModal, closeOwnerActionsModal]);

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
