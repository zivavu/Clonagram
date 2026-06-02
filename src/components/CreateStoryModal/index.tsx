'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DiscardDialog from '@/src/components/CreatePostModal/components/DiscardDialog';
import PostSharedStep from '@/src/components/CreatePostModal/components/PostSharedStep';
import UploadStep from '@/src/components/CreatePostModal/components/UploadStep';
import DialogOverlay from '@/src/components/DialogOverlay';
import { useCreateStoryModalStore } from '@/src/store/useCreateStoryModalStore';
import PreviewStep from './components/PreviewStep';
import SharingStoryStep from './components/SharingStoryStep';
import { styles } from './index.stylex';
import type { Step, StoryMedia } from './types';

function createStoryMedia(file: File): StoryMedia {
   return {
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
   };
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
                        elementType="story"
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
