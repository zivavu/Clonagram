'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import type { PartialUser } from '@/src/types/global';
import { extractVideoFrames } from '@/src/utils/extractVideoFrames';
import CaptionStep from './components/CaptionStep';
import CropStep from './components/CropStep';
import DiscardDialog from './components/DiscardDialog';
import EditStep from './components/EditStep';
import PostSharedStep from './components/PostSharedStep';
import SharingStep from './components/SharingStep';
import UploadStep from './components/UploadStep';
import { styles } from './index.stylex';
import {
   type AspectRatio,
   createPostMedia,
   DEFAULT_POST_SETTINGS,
   type PostData,
   type PostLocation,
   type PostMedia,
   type PostSettings,
   revokeMediaUrls,
   type Step,
} from './types';

const MAX_FILES = 10;
const TOAST_DURATION = 3000;

export default function CreatePostModal() {
   const { isOpen, close } = useCreatePostModalStore();
   const [step, setStep] = useState<Step>('upload');
   const [files, setFiles] = useState<PostMedia[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isDragActive, setIsDragActive] = useState(false);
   const [aspectRatio, setAspectRatio] = useState<AspectRatio>('original');
   const [caption, setCaption] = useState('');
   const [location, setLocation] = useState<PostLocation | null>(null);
   const [collaborators, setCollaborators] = useState<PartialUser[]>([]);
   const [postSettings, setPostSettings] = useState<PostSettings>(DEFAULT_POST_SETTINGS);
   const [isDiscardOpen, setIsDiscardOpen] = useState(false);
   const [fileLimitToast, setFileLimitToast] = useState<number | null>(null);
   const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const filesRef = useRef(files);
   filesRef.current = files;

   const showToast = useCallback((count: number) => {
      setFileLimitToast(count);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setFileLimitToast(null), TOAST_DURATION);
   }, []);

   const onDrop = useCallback(
      (acceptedFiles: File[]) => {
         if (acceptedFiles.length === 0) return;
         const remainingSlots = MAX_FILES - filesRef.current.length;

         if (remainingSlots <= 0) {
            showToast(acceptedFiles.length);
            return;
         }

         const filesToProcess = acceptedFiles.slice(0, remainingSlots);
         const cutCount = acceptedFiles.length - filesToProcess.length;
         if (cutCount > 0) showToast(cutCount);

         const newFiles = filesToProcess.map(createPostMedia);
         setFiles(prev => [...prev, ...newFiles]);
         setStep('crop');

         for (const media of newFiles) {
            if (media.type !== 'video') continue;
            extractVideoFrames(media.preview)
               .then(({ urls, duration }) => {
                  setFiles(prev =>
                     prev.map(f =>
                        f.preview === media.preview
                           ? { ...f, frames: urls, duration, trimEnd: duration }
                           : f,
                     ),
                  );
               })
               .catch(() => {});
         }
      },
      [showToast],
   );

   const { getRootProps, getInputProps, open } = useDropzone({
      onDrop,
      accept: {
         'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
         'video/*': ['.mp4', '.mov', '.webm'],
      },
      noClick: true,
      noKeyboard: true,
      onDragEnter: () => setIsDragActive(true),
      onDragLeave: () => setIsDragActive(false),
   });

   const resetState = () => {
      for (const f of files) revokeMediaUrls(f);
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

   const requestClose = () => {
      if (isDiscardOpen) setIsDiscardOpen(false);
      else if (step === 'upload' || step === 'post-shared') performClose();
      else if (step === 'sharing') return;
      else setIsDiscardOpen(true);
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

   const postData: PostData = {
      media: files,
      aspectRatio,
      caption,
      location,
      collaborators,
      postSettings,
   };

   return (
      <Dialog.Root open={isOpen} onOpenChange={open => !open && requestClose()}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
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
                        Upload a photo or video
                     </Dialog.Description>
                     <UploadStep
                        getRootProps={getRootProps}
                        open={open}
                        isDragActive={isDragActive}
                     />
                  </>
               )}
               {step === 'crop' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Crop your photo
                     </Dialog.Description>
                     <CropStep
                        files={files}
                        currentIndex={currentIndex}
                        onBack={resetState}
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
                     <Dialog.Description style={{ display: 'none' }}>
                        Edit your post
                     </Dialog.Description>
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
                     <Dialog.Description style={{ display: 'none' }}>
                        Add caption and details
                     </Dialog.Description>
                     <CaptionStep
                        files={files}
                        currentIndex={currentIndex}
                        onSelectIndex={setCurrentIndex}
                        onUpdateFile={handleUpdateFile}
                        onBack={() => setStep('edit')}
                        onShare={() => setStep('sharing')}
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
               {step === 'sharing' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Sharing your post
                     </Dialog.Description>
                     <SharingStep postData={postData} onDone={() => setStep('post-shared')} />
                  </>
               )}
               {step === 'post-shared' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Post shared
                     </Dialog.Description>
                     <PostSharedStep onDone={performClose} />
                  </>
               )}
               {isDiscardOpen && (
                  <DiscardDialog
                     onCancel={() => setIsDiscardOpen(false)}
                     onConfirm={performClose}
                  />
               )}
               {fileLimitToast !== null && (
                  <div {...stylex.props(styles.toast)}>
                     {fileLimitToast} file
                     {fileLimitToast > 1 ? 's' : ''} were not uploaded. You can only choose 10 or
                     fewer files.
                  </div>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
