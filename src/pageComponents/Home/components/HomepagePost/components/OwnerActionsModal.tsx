'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { deletePost } from '../../../../../actions/post/deletePost';
import { toast } from '../../../../../components/AppToast';
import DeleteConfirmModal from '../../../../../components/DeleteConfirmModal';
import { useOwnerActionsModal } from '../../../../../store/useOwnerActionsModalStore';
import { styles } from './OwnerActionsModal.stylex';

interface Action {
   label: string;
   buttonStyle?: React.HTMLAttributes<HTMLButtonElement>['style'];
   action: () => Promise<void> | void;
}

export default function OwnerActionsModal() {
   const { isOpen, postId, close } = useOwnerActionsModal();
   const [isLoading, setIsLoading] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);

   async function handleDelete() {
      setIsLoading(true);
      if (!postId) throw new Error('The post ID was not provided');
      try {
         await deletePost({ postId });
         toast('Post deleted.');
      } catch (error) {
         toast(error instanceof Error ? error.message : 'Could not delete post');
      } finally {
         setIsLoading(false);
         setShowConfirm(false);
      }
   }

   const actions: Action[] = [
      {
         label: 'Delete',
         buttonStyle: { color: '#ed4956', fontWeight: 700 },
         action: () => {
            close();
            setShowConfirm(true);
         },
      },
      { label: 'Edit', action: () => {} },
      { label: 'Share to...', action: () => {} },
      {
         label: 'Copy link',
         action: () => {
            navigator.clipboard.writeText(window.location.href);
         },
      },
      {
         label: 'Cancel',
         action: () => {
            close();
         },
      },
   ] as const;

   return (
      <>
         <Dialog.Root open={isOpen} onOpenChange={close}>
            <Dialog.Portal>
               <Dialog.Overlay {...stylex.props(styles.overlay)} />
               <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
                  <Dialog.Title style={{ display: 'none' }}>Post Actions</Dialog.Title>
                  <Dialog.Description style={{ display: 'none' }}>
                     Select an action to perform on this post.
                  </Dialog.Description>
                  {actions.map((action, index) => (
                     <Fragment key={action.label}>
                        {index === 0 ? null : (
                           <Separator
                              orientation="horizontal"
                              {...stylex.props(styles.separator)}
                           />
                        )}
                        <button
                           type="button"
                           style={action.buttonStyle}
                           disabled={isLoading}
                           onClick={() => {
                              action.action();
                           }}
                           {...stylex.props(styles.actionButton)}
                        >
                           {action.label}
                        </button>
                     </Fragment>
                  ))}
               </Dialog.Content>
            </Dialog.Portal>
         </Dialog.Root>

         <DeleteConfirmModal
            open={showConfirm}
            onOpenChange={setShowConfirm}
            onConfirm={handleDelete}
            isLoading={isLoading}
         />
      </>
   );
}
