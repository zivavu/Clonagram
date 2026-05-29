'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { usePostViewModal } from '../../store/postViewModalStore';
import { useOwnerActionsModal } from '../../store/useOwnerActionsModalStore';

export default function ModalResetOnNav() {
   const pathname = usePathname();
   const closePostViewModal = usePostViewModal(state => state.close);
   const closeOwnerActionsModal = useOwnerActionsModal(state => state.close);

   // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is an intentional trigger
   useEffect(() => {
      closePostViewModal();
      closeOwnerActionsModal();
   }, [pathname, closePostViewModal, closeOwnerActionsModal]);

   return null;
}
