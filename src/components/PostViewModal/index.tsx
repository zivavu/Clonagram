'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { usePostViewModal } from '../../store/postViewModalStore';
import DialogOverlay from '../DialogOverlay';

export default function PostFullViewModal() {
   const { isOpen, post, close } = usePostViewModal();

   if (!post) return null;

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content onEscapeKeyDown={close}>
               <Dialog.Title style={{ display: 'none' }}>
                  Full view {post.user.username} post
               </Dialog.Title>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
