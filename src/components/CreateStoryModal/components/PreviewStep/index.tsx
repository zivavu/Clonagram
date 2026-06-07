'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import StepHeader, {
   StepHeaderAction,
} from '@/src/components/CreatePostModal/components/StepHeader';
import VolumeControl from '@/src/components/VolumeControl';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import type { StoryMedia } from '../../types';
import { styles } from './index.stylex';

interface PreviewStepProps {
   media: StoryMedia;
   onBack: () => void;
   onShare: () => void;
}

export default function PreviewStep({ media, onBack, onShare }: PreviewStepProps) {
   const { volume } = usePlayerStore();
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      video.volume = volume;
      video.muted = volume === 0;
   }, [volume]);

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
                  ref={videoRef}
                  {...stylex.props(styles.media)}
                  src={media.preview}
                  autoPlay
                  loop
                  muted
                  playsInline
               />
            )}
            {media.type === 'video' && (
               <div {...stylex.props(styles.controls)}>
                  <VolumeControl side="top" />
               </div>
            )}
         </div>
         <Dialog.Description style={{ display: 'none' }}>Preview your story</Dialog.Description>
      </div>
   );
}
