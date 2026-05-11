'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import type { PartialUser } from '@/src/types/global';
import CaptionStep from './components/CaptionStep';
import CropStep from './components/CropStep';
import EditStep from './components/EditStep';
import UploadStep from './components/UploadStep';
import { styles } from './index.stylex';
import type { AspectRatio, PostMedia, PostSettings, Step } from './types';

const MAX_FILES = 10;

const DEFAULT_POST_SETTINGS: PostSettings = {
   hideLikes: false,
   commentsOff: false,
   shareToThreads: false,
   shareToFacebook: false,
   shareToClonedbook: false,
};

export default function CreatePostModal() {
   const { isOpen, close } = useCreatePostModalStore();
   const [step, setStep] = useState<Step>('upload');
   const [files, setFiles] = useState<PostMedia[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isDragActive, setIsDragActive] = useState(false);
   const [aspectRatio, setAspectRatio] = useState<AspectRatio>('original');
   const [caption, setCaption] = useState('');
   const [location, setLocation] = useState<string | null>(null);
   const [collaborators, setCollaborators] = useState<PartialUser[]>([]);
   const [postSettings, setPostSettings] = useState<PostSettings>(DEFAULT_POST_SETTINGS);
   const [isDiscardOpen, setIsDiscardOpen] = useState(false);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const newFiles: PostMedia[] = acceptedFiles.map(file => ({
         file,
         preview: URL.createObjectURL(file),
         zoom: 1,
         panX: 0,
         panY: 0,
         filterPreset: 'Original',
         filterStrength: 100,
         adjustments: { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 },
         tags: [],
      }));
      setFiles(prev => [...prev, ...newFiles].slice(0, MAX_FILES));
      setStep('crop');
   }, []);

   const { getRootProps, getInputProps, open } = useDropzone({
      onDrop,
      accept: {
         'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
         'video/*': ['.mp4', '.mov', '.webm'],
      },
      maxFiles: MAX_FILES,
      noClick: true,
      noKeyboard: true,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
   });

   const resetState = () => {
      for (const f of files) {
         URL.revokeObjectURL(f.preview);
      }
      setFiles([]);
      setCurrentIndex(0);
      setStep('upload');
      setAspectRatio('original');
      setCaption('');
      setLocation(null);
      setCollaborators([]);
      setPostSettings(DEFAULT_POST_SETTINGS);
      setIsDiscardOpen(false);
   };

   const performClose = () => {
      resetState();
      close();
   };

   const handleOpenChange = (open: boolean) => {
      if (!open) {
         if (isDiscardOpen) {
            setIsDiscardOpen(false);
         } else if (step === 'upload') {
            performClose();
         } else {
            setIsDiscardOpen(true);
         }
      }
   };

   const handleEscapeKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (isDiscardOpen) {
         setIsDiscardOpen(false);
      } else if (step !== 'upload') {
         setIsDiscardOpen(true);
      } else {
         performClose();
      }
   };

   const handleUpdateFile = (index: number, updates: Partial<PostMedia>) => {
      setFiles(prev => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)));
   };

   const handleRemoveFile = (index: number) => {
      setFiles(prev => {
         const next = prev.filter((_, i) => i !== index);
         if (next.length === 0) setStep('upload');
         if (currentIndex >= next.length && next.length > 0) setCurrentIndex(next.length - 1);
         return next;
      });
   };

   const handleReorderFiles = (fromIndex: number, toIndex: number) => {
      setFiles(prev => {
         const next = [...prev];
         const [moved] = next.splice(fromIndex, 1);
         next.splice(toIndex, 0, moved);
         return next;
      });
   };

   const handleBackToUpload = () => {
      resetState();
   };

   return (
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={handleEscapeKeyDown}>
               <input {...getInputProps()} style={{ display: 'none' }} />
               {step === 'upload' && <UploadStep getRootProps={getRootProps} open={open} isDragActive={isDragActive} />}
               {step === 'crop' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>Crop your photo</Dialog.Description>
                     <CropStep
                        files={files}
                        currentIndex={currentIndex}
                        onBack={handleBackToUpload}
                        onNext={() => setStep('edit')}
                        onSelectIndex={setCurrentIndex}
                        onRemoveFile={handleRemoveFile}
                        onUpdateFile={handleUpdateFile}
                        onReorderFiles={handleReorderFiles}
                        onAddFiles={open}
                        aspectRatio={aspectRatio}
                        onAspectRatioChange={setAspectRatio}
                     />
                  </>
               )}
               {step === 'edit' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>Edit your post</Dialog.Description>
                     <EditStep
                        files={files}
                        currentIndex={currentIndex}
                        onBack={() => setStep('crop')}
                        onNext={() => setStep('caption')}
                        onSelectIndex={setCurrentIndex}
                        onUpdateFile={handleUpdateFile}
                        aspectRatio={aspectRatio}
                     />
                  </>
               )}
               {step === 'caption' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>Add caption and details</Dialog.Description>
                     <CaptionStep
                        files={files}
                        currentIndex={currentIndex}
                        onSelectIndex={setCurrentIndex}
                        onUpdateFile={handleUpdateFile}
                        onBack={() => setStep('edit')}
                        onShare={performClose}
                        aspectRatio={aspectRatio}
                        caption={caption}
                        onCaptionChange={setCaption}
                        location={location}
                        onLocationChange={setLocation}
                        collaborators={collaborators}
                        onCollaboratorsChange={setCollaborators}
                        postSettings={postSettings}
                        onPostSettingsChange={setPostSettings}
                     />
                  </>
               )}
               {isDiscardOpen && (
                  <>
                     <button
                        type="button"
                        aria-label="Close confirmation"
                        {...stylex.props(styles.discardOverlay)}
                        onClick={() => setIsDiscardOpen(false)}
                     />
                     <div {...stylex.props(styles.discardCard)}>
                        <h3 {...stylex.props(styles.discardTitle)}>Discard post?</h3>
                        <p {...stylex.props(styles.discardSubtitle)}>If you leave, your edits won't be saved.</p>
                        <button
                           type="button"
                           {...stylex.props(styles.discardButton, styles.discardDanger)}
                           onClick={performClose}
                        >
                           Discard
                        </button>
                        <button
                           type="button"
                           {...stylex.props(styles.discardButton)}
                           onClick={() => setIsDiscardOpen(false)}
                        >
                           Cancel
                        </button>
                     </div>
                  </>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
