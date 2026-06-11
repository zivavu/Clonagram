'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
   useNotificationsPortalStore,
   useOwnerActionsModal,
   useSearchPortalStore,
} from '../../store/createModalStore';
import { usePostViewModal } from '../../store/usePostViewModalStore';

const POST_URL_PATTERN = /^\/profile\/[^/]+\/[^/]+$/;

function useIsMobile() {
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      if (typeof window === 'undefined') return;
      const mq = window.matchMedia('(max-width: 767px)');
      setIsMobile(mq.matches);
      function onChange(e: MediaQueryListEvent) {
         setIsMobile(e.matches);
      }
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
   }, []);

   return isMobile;
}

export default function ModalResetOnNav() {
   const pathname = usePathname();
   const isMobile = useIsMobile();
   const closePostViewModal = usePostViewModal(state => state.close);
   const closeOwnerActionsModal = useOwnerActionsModal(state => state.close);
   const closeNotificationsModal = useNotificationsPortalStore(state => state.close);
   const closeSearchPortal = useSearchPortalStore(state => state.close);

   // biome-ignore lint/correctness/useExhaustiveDependencies: The pathname dependency is intentional.
   useEffect(() => {
      closeNotificationsModal();
   }, [pathname, closeNotificationsModal]);

   useEffect(() => {
      if (POST_URL_PATTERN.test(pathname)) return;
      closePostViewModal();
      closeOwnerActionsModal();
      closeNotificationsModal();
      if (isMobile) closeSearchPortal();
   }, [
      pathname,
      closePostViewModal,
      closeOwnerActionsModal,
      closeNotificationsModal,
      closeSearchPortal,
      isMobile,
   ]);

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
