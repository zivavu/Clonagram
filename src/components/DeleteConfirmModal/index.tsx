'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface DeleteConfirmModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void | Promise<void>;
   isLoading?: boolean;
}

export default function DeleteConfirmModal({
   open,
   onOpenChange,
   onConfirm,
   isLoading = false,
}: DeleteConfirmModalProps) {
   return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)}>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>Delete post?</Dialog.Title>
                  <Dialog.Description {...stylex.props(styles.description)}>
                     Are you sure you want to delete this post?
                  </Dialog.Description>
               </div>
               <Separator orientation="horizontal" {...stylex.props(styles.separator)} />
               <button
                  type="button"
                  style={{ color: '#ed4956', fontWeight: 700 }}
                  disabled={isLoading}
                  onClick={onConfirm}
                  {...stylex.props(styles.actionButton)}
               >
                  Delete
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
