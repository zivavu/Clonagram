'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface DeleteChatConfirmModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   disabled?: boolean;
}

export default function DeleteChatConfirmModal({
   open,
   onOpenChange,
   onConfirm,
   disabled,
}: DeleteChatConfirmModalProps) {
   return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)}>
               <Dialog.Title style={{ display: 'none' }}>Delete chat from inbox?</Dialog.Title>
               <Dialog.Description style={{ display: 'none' }}>
                  Confirm deleting this chat
               </Dialog.Description>
               <div {...stylex.props(styles.body)}>
                  <span {...stylex.props(styles.title)}>Delete chat from inbox?</span>
                  <span {...stylex.props(styles.subtitle)}>
                     This will remove the chat from your inbox and erase the chat history. To stop
                     receiving new messages from this account, first block the account then delete
                     the chat.
                  </span>
               </div>
               <div {...stylex.props(styles.divider)} />
               <button
                  type="button"
                  {...stylex.props(styles.actionButton, styles.deleteButton)}
                  onClick={onConfirm}
                  disabled={disabled}
               >
                  Delete
               </button>
               <div {...stylex.props(styles.divider)} />
               <Dialog.Close asChild>
                  <button type="button" {...stylex.props(styles.actionButton)} disabled={disabled}>
                     Cancel
                  </button>
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
