'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { getArchivedStories } from '@/src/actions/story/getArchivedStories';
import { getHighlightStoryIds } from '@/src/actions/story/getHighlightStoryIds';
import { updateHighlightStories } from '@/src/actions/story/updateHighlightStories';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import { queryKeys } from '@/src/lib/queryKeys';
import { useEditHighlightStoriesModalStore } from '@/src/store/createModalStore';
import DialogOverlay from '../DialogOverlay';
import SelectStoriesStep from '../NewHighlightModal/components/SelectStoriesStep';
import { styles } from './index.stylex';

export default function EditHighlightStoriesModal() {
   const { isOpen, data, close } = useEditHighlightStoriesModalStore();
   const [localSelectedIds, setLocalSelectedIds] = useState<Set<string> | null>(null);
   const [lastHighlightId, setLastHighlightId] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

   const { data: stories = null } = useQuery({
      queryKey: queryKeys.archivedStories(),
      queryFn: () => getArchivedStories(),
      enabled: isOpen,
      staleTime: 30_000,
   });

   const { data: highlightStoryIds = [] } = useQuery({
      queryKey: queryKeys.highlightStoryIds(data?.highlightId ?? ''),
      queryFn: () => getHighlightStoryIds({ highlightId: data?.highlightId ?? '' }),
      enabled: isOpen && !!data,
      staleTime: 30_000,
   });

   const highlightId = data?.highlightId ?? null;
   if (highlightId !== lastHighlightId) {
      setLastHighlightId(highlightId);
      setLocalSelectedIds(null);
   }

   const selectedIds = localSelectedIds ?? new Set(highlightStoryIds);

   function handleClose() {
      close();
      setTimeout(() => {
         setLocalSelectedIds(null);
         setLastHighlightId(null);
      }, 200);
   }

   function toggleStory(id: string) {
      setLocalSelectedIds(prev => {
         const base = prev ?? new Set(highlightStoryIds);
         const next = new Set(base);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   }

   async function handleDone() {
      if (!data || selectedIds.size === 0) return;
      setLoading(true);
      try {
         await updateHighlightStories({
            highlightId: data.highlightId,
            storyIds: [...selectedIds],
         });
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
               <HiddenDialogDescription>
                  Edit which stories are included in this highlight
               </HiddenDialogDescription>
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
