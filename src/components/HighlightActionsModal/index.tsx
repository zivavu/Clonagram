'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoArrowBack, IoCloseOutline } from 'react-icons/io5';
import { deleteHighlight } from '@/src/actions/story/deleteHighlight';
import { editHighlight } from '@/src/actions/story/editHighlight';
import {
   useEditHighlightStoriesModalStore,
   useHighlightActionsModalStore,
} from '@/src/store/createModalStore';
import DialogOverlay from '../DialogOverlay';
import { styles } from './index.stylex';

type Step = 'list' | 'rename' | 'confirm-delete';

export default function HighlightActionsModal() {
   const { isOpen, data, close } = useHighlightActionsModalStore();
   const openEditStories = useEditHighlightStoriesModalStore(s => s.open);
   const [step, setStep] = useState<Step>('list');
   const [title, setTitle] = useState('');
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   function handleOpenChange(open: boolean) {
      if (!open) handleClose();
   }

   function handleClose() {
      close();
      setTimeout(() => setStep('list'), 200);
   }

   function handleOpenRename() {
      setTitle(data?.title ?? '');
      setStep('rename');
   }

   function handleEditStories() {
      if (!data) return;
      close();
      openEditStories({ highlightId: data.highlightId });
   }

   async function handleSaveRename() {
      if (!data || !title.trim()) return;
      setLoading(true);
      try {
         await editHighlight({ id: data.highlightId, title: title.trim() });
         handleClose();
      } finally {
         setLoading(false);
      }
   }

   async function handleDelete() {
      if (!data) return;
      setLoading(true);
      try {
         await deleteHighlight({ id: data.highlightId });
         close();
         router.push(data.closeHref);
      } finally {
         setLoading(false);
      }
   }

   return (
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content {...stylex.props(styles.content)}>
               <Dialog.Description style={{ display: 'none' }}>
                  Manage this highlight
               </Dialog.Description>
               {step === 'list' && (
                  <>
                     <div {...stylex.props(styles.header)}>
                        <Dialog.Title {...stylex.props(styles.title)}>Highlight </Dialog.Title>
                        <Dialog.Close asChild>
                           <button
                              type="button"
                              aria-label="Close"
                              {...stylex.props(styles.iconButton, styles.closeButton)}
                           >
                              <IoCloseOutline size={22} />
                           </button>
                        </Dialog.Close>
                     </div>
                     <button
                        type="button"
                        onClick={handleEditStories}
                        {...stylex.props(styles.actionButton)}
                     >
                        Edit stories
                     </button>
                     <div {...stylex.props(styles.separator)} />
                     <button
                        type="button"
                        onClick={handleOpenRename}
                        {...stylex.props(styles.actionButton)}
                     >
                        Rename
                     </button>
                     <div {...stylex.props(styles.separator)} />
                     <button
                        type="button"
                        onClick={() => setStep('confirm-delete')}
                        {...stylex.props(styles.actionButton, styles.dangerButton)}
                     >
                        Delete
                     </button>
                  </>
               )}

               {step === 'rename' && (
                  <>
                     <div {...stylex.props(styles.header)}>
                        <button
                           type="button"
                           aria-label="Back"
                           onClick={() => setStep('list')}
                           {...stylex.props(styles.iconButton, styles.backButton)}
                        >
                           <IoArrowBack size={20} />
                        </button>
                        <Dialog.Title {...stylex.props(styles.title)}>Edit highlight</Dialog.Title>
                        <Dialog.Close asChild>
                           <button
                              type="button"
                              aria-label="Close"
                              {...stylex.props(styles.iconButton, styles.closeButton)}
                           >
                              <IoCloseOutline size={22} />
                           </button>
                        </Dialog.Close>
                     </div>
                     <div {...stylex.props(styles.renameBody)}>
                        <input
                           type="text"
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                           maxLength={60}
                           {...stylex.props(styles.input)}
                        />
                     </div>
                     <div {...stylex.props(styles.separator)} />
                     <button
                        type="button"
                        onClick={handleSaveRename}
                        disabled={!title.trim() || loading}
                        {...stylex.props(styles.actionButton)}
                     >
                        Save
                     </button>
                  </>
               )}

               {step === 'confirm-delete' && (
                  <>
                     <div {...stylex.props(styles.confirmBody)}>
                        <Dialog.Title {...stylex.props(styles.confirmTitle)}>
                           Delete highlight?
                        </Dialog.Title>
                        <Dialog.Description {...stylex.props(styles.confirmDescription)}>
                           If you delete this highlight, it won't be visible on your profile
                           anymore.
                        </Dialog.Description>
                     </div>
                     <div {...stylex.props(styles.separator)} />
                     <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        {...stylex.props(styles.actionButton, styles.dangerButton)}
                     >
                        Delete
                     </button>
                     <div {...stylex.props(styles.separator)} />
                     <button
                        type="button"
                        onClick={handleClose}
                        {...stylex.props(styles.actionButton)}
                     >
                        Cancel
                     </button>
                  </>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
