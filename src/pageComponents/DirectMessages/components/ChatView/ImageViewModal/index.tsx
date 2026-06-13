'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { IoCloseOutline } from 'react-icons/io5';
import { HiddenDialogDescription, HiddenDialogTitle } from '@/src/components/HiddenDialogLabel';
import { styles } from './index.stylex';

interface ImageViewModalProps {
   src: string | null;
   open: boolean;
   onClose: () => void;
}

export default function ImageViewModal({ src, open, onClose }: ImageViewModalProps) {
   return (
      <Dialog.Root
         open={open}
         onOpenChange={open => {
            if (!open) onClose();
         }}
      >
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)}>
               <Dialog.Content {...stylex.props(styles.content)} onPointerDownOutside={onClose}>
                  <HiddenDialogTitle>Image view</HiddenDialogTitle>
                  <HiddenDialogDescription>View full image</HiddenDialogDescription>
                  {src && (
                     /* biome-ignore lint/performance/noImgElement: dynamic fullscreen viewer with CSS max-dimensions — Image with fill requires explicit container size */
                     <img src={src} alt="" {...stylex.props(styles.image)} />
                  )}
                  <button type="button" {...stylex.props(styles.closeButton)} onClick={onClose}>
                     <IoCloseOutline />
                  </button>
               </Dialog.Content>
            </Dialog.Overlay>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
