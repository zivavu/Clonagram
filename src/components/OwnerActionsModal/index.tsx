'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { deletePost } from '../../actions/post/deletePost';
import { useOwnerActionsModal } from '../../store/createModalStore';
import { toast } from '../AppToast';
import DeleteConfirmModal from '../DeleteConfirmModal';
import DialogOverlay from '../DialogOverlay';
import EditPostModal from '../EditPostModal';
import { styles } from './index.stylex';

interface Action {
   label: string;
   buttonStyle?: React.HTMLAttributes<HTMLButtonElement>['style'];
   action: () => Promise<void> | void;
}

interface OwnerActionsModalProps {
   onFinish?: () => void;
}

export default function OwnerActionsModal({ onFinish }: OwnerActionsModalProps) {
   const { isOpen, data: postId, close } = useOwnerActionsModal();
   const [isLoading, setIsLoading] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
   const [editingPostId, setEditingPostId] = useState<string | null>(null);

   async function handleDelete() {
      if (!deletingPostId) return;
      setIsLoading(true);
      try {
         await deletePost({ postId: deletingPostId });
         toast('Post deleted.');
      } catch (error) {
         toast(error instanceof Error ? error.message : 'Could not delete post. Try again.');
      } finally {
         setIsLoading(false);
         setShowConfirm(false);
         setDeletingPostId(null);
         if (onFinish) onFinish();
      }
   }

   const actions: Action[] = [
      {
         label: 'Delete',
         buttonStyle: { color: '#ed4956', fontWeight: 700 },
         action: () => {
            setDeletingPostId(postId);
            close();
            setShowConfirm(true);
         },
      },
      {
         label: 'Edit',
         action: () => {
            setEditingPostId(postId);
            close();
         },
      },
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
               <DialogOverlay zIndex={50} />
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

         <EditPostModal
            isOpen={!!editingPostId}
            postId={editingPostId}
            onClose={() => setEditingPostId(null)}
         />
      </>
   );
}
