'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import { styles } from './index.stylex';

interface ChangePhotoModalProps {
   isOpen: boolean;
   onClose: () => void;
   onUpload: (file: File) => Promise<void>;
   onRemove: () => Promise<void>;
}

export default function ChangePhotoModal({
   isOpen,
   onClose,
   onUpload,
   onRemove,
}: ChangePhotoModalProps) {
   const inputRef = useRef<HTMLInputElement>(null);

   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
   }

   return (
      <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)}>
               <Dialog.Title {...stylex.props(styles.title)}>Change Profile Photo</Dialog.Title>
               <HiddenDialogDescription>
                  Upload or remove your profile photo.
               </HiddenDialogDescription>
               <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
               />
               <button
                  type="button"
                  {...stylex.props(styles.option, styles.optionUpload)}
                  onClick={() => inputRef.current?.click()}
               >
                  Upload Photo
               </button>
               <button
                  type="button"
                  {...stylex.props(styles.option, styles.optionRemove)}
                  onClick={onRemove}
               >
                  Remove Current Photo
               </button>
               <button type="button" {...stylex.props(styles.option)} onClick={onClose}>
                  Cancel
               </button>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
