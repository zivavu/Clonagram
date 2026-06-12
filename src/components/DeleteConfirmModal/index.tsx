'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import DialogOverlay from '../DialogOverlay';
import { styles } from './index.stylex';

interface DeleteConfirmModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void | Promise<void>;
   isLoading?: boolean;
   title?: string;
   description?: string;
   confirmLabel?: string;
}

export default function DeleteConfirmModal({
   open,
   onOpenChange,
   onConfirm,
   isLoading = false,
   title = 'Delete post?',
   description = 'Are you sure you want to delete this post?',
   confirmLabel = 'Delete',
}: DeleteConfirmModalProps) {
   return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content {...stylex.props(styles.content)}>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>{title}</Dialog.Title>
                  <Dialog.Description {...stylex.props(styles.description)}>
                     {description}
                  </Dialog.Description>
               </div>
               <Separator orientation="horizontal" {...stylex.props(styles.separator)} />
               <button
                  type="button"
                  {...stylex.props(styles.actionButton, styles.dangerButton)}
                  disabled={isLoading}
                  onClick={onConfirm}
               >
                  {confirmLabel}
               </button>
               <Separator orientation="horizontal" {...stylex.props(styles.separator)} />
               <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => onOpenChange(false)}
                  {...stylex.props(styles.actionButton)}
               >
                  Cancel
               </button>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
