'use client';

import * as Dialog from '@radix-ui/react-dialog';
import DialogOverlay from '../DialogOverlay';
import { usePostViewModal } from '../../store/postViewModalStore';

export default function PostFullViewModal() {
   const { isOpen, postId, close } = usePostViewModal();

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content onEscapeKeyDown={close}>
               <Dialog.Title style={{ display: 'none' }}>Post Actions</Dialog.Title>
               <Dialog.Description style={{ display: 'none' }}>
                  Select an action to perform on this post.
               </Dialog.Description>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
