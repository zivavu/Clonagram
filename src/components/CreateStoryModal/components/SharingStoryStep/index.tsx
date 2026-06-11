import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { IoCloseOutline } from 'react-icons/io5';
import { shared } from '@/src/components/CreatePostModal/components/Spinner.stylex';
import StepHeader from '@/src/components/CreatePostModal/components/StepHeader';
import { useUploadStory } from '@/src/components/CreateStoryModal/hooks/useUploadStory';
import type { StoryMedia } from '../../types';
import { styles } from './index.stylex';

interface SharingStoryStepProps {
   media: StoryMedia;
   onDone: () => void;
}

export default function SharingStoryStep({ media, onDone }: SharingStoryStepProps) {
   const { status, error } = useUploadStory({ media, onDone });
   const isError = status === 'error';

   return (
      <div {...stylex.props(shared.root)}>
         <StepHeader
            title="Sharing"
            rightSlot={
               <Dialog.Close asChild>
                  <button {...stylex.props(styles.closeButton)} aria-label="Close">
                     <IoCloseOutline size={30} />
                  </button>
               </Dialog.Close>
            }
         />
         <div {...stylex.props(shared.body)}>
            {isError ? (
               <>
                  <span {...stylex.props(styles.errorText)}>
                     {error ?? 'Something went wrong while sharing your story.'}
                  </span>
                  <button type="button" {...stylex.props(styles.retryButton)} onClick={onDone}>
                     Try again
                  </button>
               </>
            ) : (
               <div {...stylex.props(shared.ring, styles.spinningRing)}>
                  <div {...stylex.props(shared.ringInner)} />
               </div>
            )}
         </div>
      </div>
   );
}
