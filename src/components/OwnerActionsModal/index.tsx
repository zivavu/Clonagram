'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deletePost } from '../../actions/post/deletePost';
import { queryKeys } from '../../lib/queryKeys';
import { getErrorMessage } from '../../lib/unwrap';
import { useOwnerActionsModal } from '../../store/createModalStore';
import ActionSheetModal, { type ActionSheetAction } from '../ActionSheetModal';
import { toast } from '../AppToast';
import DeleteConfirmModal from '../DeleteConfirmModal';
import EditPostModal from '../EditPostModal';

interface OwnerActionsModalProps {
   onFinish?: () => void;
}

export default function OwnerActionsModal({ onFinish }: OwnerActionsModalProps) {
   const { isOpen, data: postId, close } = useOwnerActionsModal();
   const queryClient = useQueryClient();
   const [isLoading, setIsLoading] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
   const [editingPostId, setEditingPostId] = useState<string | null>(null);

   async function handleDelete() {
      if (!deletingPostId) return;
      setIsLoading(true);
      try {
         await deletePost({ postId: deletingPostId });
         queryClient.invalidateQueries({ queryKey: queryKeys.homeFeed('home') });
         queryClient.invalidateQueries({ queryKey: queryKeys.homeFeed('following') });
         toast('Post deleted.');
      } catch (error) {
         toast(getErrorMessage(error, 'Could not delete post. Try again.'));
      } finally {
         setIsLoading(false);
         setShowConfirm(false);
         setDeletingPostId(null);
         if (onFinish) onFinish();
      }
   }

   const actions: ActionSheetAction[] = [
      {
         label: 'Delete',
         isDanger: true,
         onSelect: () => {
            setDeletingPostId(postId);
            close();
            setShowConfirm(true);
         },
      },
      {
         label: 'Edit',
         onSelect: () => {
            setEditingPostId(postId);
            close();
         },
      },
      {
         label: 'Copy link',
         onSelect: () => {
            navigator.clipboard.writeText(window.location.href);
            close();
            toast('Link copied to clipboard.');
         },
      },
      {
         label: 'Cancel',
         onSelect: close,
      },
   ];

   return (
      <>
         <ActionSheetModal
            open={isOpen}
            onOpenChange={close}
            title="Post Actions"
            description="Select an action to perform on this post."
            showHeader={false}
            isLoading={isLoading}
            overlayZIndex={50}
            actions={actions}
         />

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
