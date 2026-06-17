'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { IoArrowBack, IoCloseOutline } from 'react-icons/io5';
import { createHighlight } from '@/src/actions/story/createHighlight';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import { getArchivedStories } from '@/src/actions/story/getArchivedStories';
import { getThumbnailUrl } from '@/src/components/ArchivedStoryCard';
import { useNewHighlightModalStore } from '@/src/store/createModalStore';
import DialogOverlay from '../DialogOverlay';
import CoverStep from './components/CoverStep';
import NameStep from './components/NameStep';
import SelectStoriesStep from './components/SelectStoriesStep';
import { styles } from './index.stylex';

type Step = 1 | 2 | 3;

const TITLES: Record<Step, string> = {
   1: 'New Highlight',
   2: 'Stories',
   3: 'Choose Cover Photo',
};

export default function NewHighlightModal() {
   const { isOpen, close } = useNewHighlightModalStore();
   const [step, setStep] = useState<Step>(1);
   const [name, setName] = useState('');
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
   const [coverId, setCoverId] = useState<string | null>(null);
   const [stories, setStories] = useState<ArchivedStory[] | null>(null);
   const [submitting, setSubmitting] = useState(false);

   function handleClose() {
      close();
      setTimeout(() => {
         setStep(1);
         setName('');
         setSelectedIds(new Set());
         setCoverId(null);
         setStories(null);
      }, 200);
   }

   function handleNext() {
      if (step === 1) {
         setStep(2);
         if (stories === null) getArchivedStories().then(setStories);
      } else if (step === 2) {
         setCoverId([...selectedIds][0] ?? null);
         setStep(3);
      }
   }

   function handleBack() {
      if (step === 2) setStep(1);
      else if (step === 3) setStep(2);
   }

   function toggleStory(id: string) {
      setSelectedIds(prev => {
         const next = new Set(prev);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   }

   async function handleAdd() {
      if (!stories) return;
      setSubmitting(true);
      try {
         const effectiveCoverId = coverId ?? [...selectedIds][0] ?? null;
         const coverStory = effectiveCoverId
            ? (stories.find(s => s.id === effectiveCoverId) ?? null)
            : null;
         const coverUrl = coverStory ? getThumbnailUrl(coverStory) : null;
         await createHighlight({ title: name, storyIds: [...selectedIds], coverUrl });
         handleClose();
      } finally {
         setSubmitting(false);
      }
   }

   const nextDisabled =
      (step === 1 && name.trim() === '') || (step === 2 && selectedIds.size === 0) || submitting;

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
               <div {...stylex.props(styles.header)}>
                  {step > 1 && (
                     <button
                        type="button"
                        onClick={handleBack}
                        aria-label="Back"
                        {...stylex.props(styles.iconButton, styles.backButton)}
                     >
                        <IoArrowBack size={22} />
                     </button>
                  )}
                  <Dialog.Title {...stylex.props(styles.title)}>{TITLES[step]}</Dialog.Title>
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

               {step === 1 && <NameStep name={name} onChange={setName} />}
               {step === 2 && (
                  <SelectStoriesStep
                     stories={stories}
                     selectedIds={selectedIds}
                     onToggle={toggleStory}
                  />
               )}
               {step === 3 && stories && (
                  <CoverStep
                     stories={stories.filter(s => selectedIds.has(s.id))}
                     coverId={coverId}
                     onCoverSelect={setCoverId}
                  />
               )}

               <div {...stylex.props(styles.footer)}>
                  <button
                     type="button"
                     onClick={step === 3 ? handleAdd : handleNext}
                     disabled={nextDisabled}
                     {...stylex.props(styles.nextButton)}
                  >
                     {step === 3 ? 'Add' : 'Next'}
                  </button>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
