'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import { getArchivedStories } from '@/src/actions/story/getArchivedStories';
import { getHighlightStoryIds } from '@/src/actions/story/getHighlightStoryIds';
import { updateHighlightStories } from '@/src/actions/story/updateHighlightStories';
import { useEditHighlightStoriesModalStore } from '@/src/store/createModalStore';
import DialogOverlay from '../DialogOverlay';
import SelectStoriesStep from '../NewHighlightModal/components/SelectStoriesStep';
import { styles } from './index.stylex';

export default function EditHighlightStoriesModal() {
   const { isOpen, data, close } = useEditHighlightStoriesModalStore();
   const [stories, setStories] = useState<ArchivedStory[] | null>(null);
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!isOpen || !data) return;
      setStories(null);
      Promise.all([getArchivedStories(), getHighlightStoryIds(data.highlightId)]).then(
         ([fetchedStories, ids]) => {
            setStories(fetchedStories);
            setSelectedIds(new Set(ids));
         },
      );
   }, [isOpen, data]);

   function handleClose() {
      close();
      setTimeout(() => {
         setStories(null);
         setSelectedIds(new Set());
      }, 200);
   }

   function toggleStory(id: string) {
      setSelectedIds(prev => {
         const next = new Set(prev);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   }

   async function handleDone() {
      if (!data || selectedIds.size === 0) return;
      setLoading(true);
      try {
         await updateHighlightStories(data.highlightId, [...selectedIds]);
         handleClose();
      } finally {
         setLoading(false);
      }
   }

   return (
      <Dialog.Root
         open={isOpen}
         onOpenChange={open => {
            if (!open) handleClose();
         }}
      >
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content {...stylex.props(styles.content)}>
               <Dialog.Description style={{ display: 'none' }}>
                  Edit which stories are included in this highlight
               </Dialog.Description>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>Edit stories</Dialog.Title>
                  <Dialog.Close asChild>
                     <button
                        type="button"
                        aria-label="Close"
                        onClick={handleClose}
                        {...stylex.props(styles.iconButton, styles.closeButton)}
                     >
                        <IoCloseOutline size={36} />
                     </button>
                  </Dialog.Close>
               </div>
               <SelectStoriesStep
                  stories={stories}
                  selectedIds={selectedIds}
                  onToggle={toggleStory}
               />
               <div {...stylex.props(styles.footer)}>
                  <button
                     type="button"
                     onClick={handleDone}
                     disabled={selectedIds.size === 0 || loading}
                     {...stylex.props(styles.nextButton)}
                  >
                     Done
                  </button>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
