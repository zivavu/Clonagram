'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import StepHeader, {
   StepHeaderAction,
} from '@/src/components/CreatePostModal/components/StepHeader';
import type { StoryMedia } from '../../types';
import { styles } from './index.stylex';

interface PreviewStepProps {
   media: StoryMedia;
   onBack: () => void;
   onShare: () => void;
}

export default function PreviewStep({ media, onBack, onShare }: PreviewStepProps) {
   return (
      <div {...stylex.props(styles.container)}>
         <StepHeader
            title="New story"
            onBack={onBack}
            rightSlot={<StepHeaderAction label="Share" onClick={onShare} />}
         />
         <div {...stylex.props(styles.previewArea)}>
            {media.type === 'image' ? (
               <Image
                  src={media.preview}
                  alt=""
                  fill
                  sizes="480px"
                  style={{ objectFit: 'cover' }}
               />
            ) : (
               <video
                  {...stylex.props(styles.media)}
                  src={media.preview}
                  autoPlay
                  loop
                  muted
                  playsInline
               />
            )}
         </div>
         <Dialog.Description style={{ display: 'none' }}>Preview your story</Dialog.Description>
      </div>
   );
}
