'use client';

import ActionSheetModal from '../ActionSheetModal';

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
      <ActionSheetModal
         open={open}
         onOpenChange={onOpenChange}
         title={title}
         description={description}
         isLoading={isLoading}
         isModal={false}
         actions={[
            { label: confirmLabel, onSelect: onConfirm, isDanger: true },
            { label: 'Cancel', onSelect: () => onOpenChange(false) },
         ]}
      />
   );
}
