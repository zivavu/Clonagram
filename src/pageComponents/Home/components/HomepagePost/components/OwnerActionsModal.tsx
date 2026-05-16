import * as Dialog from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { Fragment } from 'react/jsx-runtime';
import { useOwnerActionsModal } from '../../../../../store/useOwnerActionsModalStore';
import { styles } from './OwnerActionsModal.stylex';

export default function OwnerActionsModal() {
   const { isOpen, close } = useOwnerActionsModal();

   const actions = ['Delete', 'Edit', 'Share to...', 'Copy link', 'Cancel'];

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <Dialog.Title style={{ display: 'none' }}>Post Actions</Dialog.Title>
               <Dialog.Description style={{ display: 'none' }}>
                  Select an action to perform on this post.
               </Dialog.Description>
               {actions.map((action, index) => (
                  <Fragment key={action}>
                     {index === 0 ? null : (
                        <Separator orientation="horizontal" {...stylex.props(styles.separator)} />
                     )}
                     <button type="button" key={action} {...stylex.props(styles.actionButton)}>
                        {action}
                     </button>
                  </Fragment>
               ))}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
