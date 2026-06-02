'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloseOutline } from 'react-icons/io5';
import DiscardDialog from '@/src/components/CreatePostModal/components/DiscardDialog';
import PostSharedStep from '@/src/components/CreatePostModal/components/PostSharedStep';
import { shared } from '@/src/components/CreatePostModal/components/Spinner.stylex';
import StepHeader from '@/src/components/CreatePostModal/components/StepHeader';
import UploadStep from '@/src/components/CreatePostModal/components/UploadStep';
import { useUploadStory } from '@/src/components/CreateStoryModal/hooks/useUploadStory';
import DialogOverlay from '@/src/components/DialogOverlay';
import { useCreateStoryModalStore } from '@/src/store/useCreateStoryModalStore';
import { colors, radius } from '../../styles/tokens.stylex';
import PreviewStep from './components/PreviewStep';
import { styles } from './index.stylex';
import type { Step, StoryMedia } from './types';

const spin = stylex.keyframes({
   from: { transform: 'rotate(0deg)' },
   to: { transform: 'rotate(360deg)' },
});

const sharingStyles = stylex.create({
   spinningRing: {
      animationName: spin,
      animationDuration: '0.5s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
   },
   errorText: {
      color: colors.textPrimary,
      fontSize: 14,
      textAlign: 'center',
      padding: '0 24px',
      maxWidth: 320,
   },
   retryButton: {
      marginTop: 16,
      padding: '8px 24px',
      borderRadius: radius.md,
      backgroundColor: colors.textPrimary,
      color: colors.bg,
      fontSize: 14,
      fontWeight: 600,
   },
   closeButton: {
      display: 'flex',
      color: colors.textPrimary,
      borderRadius: radius.full,
      ':hover': { backgroundColor: colors.buttonHover },
   },
});

function createStoryMedia(file: File): StoryMedia {
   return {
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
   };
}

interface SharingStoryStepProps {
   media: StoryMedia;
   onDone: () => void;
}

function SharingStoryStep({ media, onDone }: SharingStoryStepProps) {
   const { status, error } = useUploadStory({ media, onDone });
   const isError = status === 'error';

   return (
      <div {...stylex.props(shared.root)}>
         <StepHeader
            title="Sharing"
            rightSlot={
               <Dialog.Close asChild>
                  <button {...stylex.props(sharingStyles.closeButton)} aria-label="Close">
                     <IoCloseOutline style={{ fontSize: 30 }} />
                  </button>
               </Dialog.Close>
            }
         />
         <div {...stylex.props(shared.body)}>
            {isError ? (
               <>
                  <span {...stylex.props(sharingStyles.errorText)}>
                     {error ?? 'Something went wrong while sharing your story.'}
                  </span>
                  <button
                     type="button"
                     {...stylex.props(sharingStyles.retryButton)}
                     onClick={onDone}
                  >
                     Try again
                  </button>
               </>
            ) : (
               <div {...stylex.props(shared.ring, sharingStyles.spinningRing)}>
                  <div {...stylex.props(shared.ringInner)} />
               </div>
            )}
         </div>
      </div>
   );
}

export default function CreateStoryModal() {
   const { isOpen, close } = useCreateStoryModalStore();
   const [step, setStep] = useState<Step>('upload');
   const [media, setMedia] = useState<StoryMedia | null>(null);
   const [isDiscardOpen, setIsDiscardOpen] = useState(false);
   const [isDragActive, setIsDragActive] = useState(false);
   const mediaRef = useRef<StoryMedia | null>(null);
   mediaRef.current = media;

   const { getRootProps, getInputProps, open } = useDropzone({
      onDrop(acceptedFiles: File[]) {
         if (acceptedFiles.length === 0) return;
         setMedia(createStoryMedia(acceptedFiles[0]));
         setStep('preview');
      },
      accept: {
         'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
         'video/*': ['.mp4', '.mov', '.webm'],
      },
      maxFiles: 1,
      noClick: true,
      noKeyboard: true,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
   });

   const resetState = () => {
      if (mediaRef.current) URL.revokeObjectURL(mediaRef.current.preview);
      setMedia(null);
      setStep('upload');
      setIsDiscardOpen(false);
      setIsDragActive(false);
   };

   const performClose = () => {
      resetState();
      close();
   };

   const requestClose = () => {
      if (isDiscardOpen) setIsDiscardOpen(false);
      else if (step === 'upload' || step === 'story-shared') performClose();
      else setIsDiscardOpen(true);
   };

   return (
      <Dialog.Root open={isOpen} onOpenChange={open => !open && requestClose()}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content
               {...stylex.props(styles.content)}
               onEscapeKeyDown={e => {
                  e.preventDefault();
                  requestClose();
               }}
            >
               <input {...getInputProps()} style={{ display: 'none' }} />

               {step === 'upload' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Upload a photo or video for your story
                     </Dialog.Description>
                     <UploadStep
                        getRootProps={getRootProps}
                        open={open}
                        isDragActive={isDragActive}
                        isReel={false}
                     />
                  </>
               )}

               {step === 'preview' && media && (
                  <PreviewStep
                     media={media}
                     onBack={resetState}
                     onShare={() => setStep('sharing')}
                  />
               )}

               {step === 'sharing' && media && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Sharing your story
                     </Dialog.Description>
                     <SharingStoryStep media={media} onDone={() => setStep('story-shared')} />
                  </>
               )}

               {step === 'story-shared' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Story shared
                     </Dialog.Description>
                     <PostSharedStep
                        onDone={performClose}
                        title="Story shared"
                        message="Your story has been shared."
                     />
                  </>
               )}

               {isDiscardOpen && (
                  <DiscardDialog
                     onCancel={() => setIsDiscardOpen(false)}
                     onConfirm={performClose}
                  />
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
