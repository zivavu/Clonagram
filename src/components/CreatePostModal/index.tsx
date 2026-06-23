'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import { useCreatePostModalStore } from '@/src/store/createModalStore';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import type { PartialUser } from '@/src/types/global';
import { extractVideoFrames } from '@/src/utils/extractVideoFrames';
import DialogOverlay from '../DialogOverlay';
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
const MIN_IMAGE_WIDTH = 468;
const MIN_IMAGE_HEIGHT = 150;

function getImageDimensions(file: File): Promise<{ w: number; h: number }> {
   return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
         URL.revokeObjectURL(url);
         resolve({ w: img.naturalWidth, h: img.naturalHeight });
      };
      img.onerror = () => {
         URL.revokeObjectURL(url);
         reject(new Error('Failed to load image'));
      };
      img.src = url;
   });
}

export default function CreatePostModal() {
   const { isOpen, close, mode } = useCreatePostModalStore();
   return (
      <Dialog.Root open={isOpen} onOpenChange={open => !open && close()}>
         <Dialog.Portal>
            <DialogOverlay />
            {isOpen && <CreatePostModalContent isReel={mode === 'reel'} close={close} />}
         </Dialog.Portal>
      </Dialog.Root>
   );
}

interface CreatePostModalContentProps {
   isReel: boolean;
   close: () => void;
}

function CreatePostModalContent({ isReel, close }: CreatePostModalContentProps) {
   const { pauseAll } = usePlayerStore();
   const [step, setStep] = useState<Step>('upload');
   const [files, setFiles] = useState<PostMedia[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isDragActive, setIsDragActive] = useState(false);
   const [aspectRatio, setAspectRatio] = useState<AspectRatio>(isReel ? '9:16' : 'original');
   const [caption, setCaption] = useState('');
   const [location, setLocation] = useState<PostLocation | null>(null);
   const [collaborators, setCollaborators] = useState<PartialUser[]>([]);
   const [postSettings, setPostSettings] = useState<PostSettings>(DEFAULT_POST_SETTINGS);
   const [isDiscardOpen, setIsDiscardOpen] = useState(false);
   const [fileLimitToast, setFileLimitToast] = useState<number | null>(null);
   const [tooSmallToast, setTooSmallToast] = useState(false);
   const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const filesRef = useRef(files);
   filesRef.current = files;

   useEffect(() => {
      pauseAll();
      return () => {
         for (const f of filesRef.current) revokeMediaUrls(f);
      };
   }, [pauseAll]);

   function showToast(count: number) {
      setFileLimitToast(count);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setFileLimitToast(null), TOAST_DURATION);
   }

   async function onDrop(acceptedFiles: File[]) {
      if (acceptedFiles.length === 0) return;
      if (isReel && filesRef.current.length >= 1) return;
      const remainingSlots = (isReel ? 1 : MAX_FILES) - filesRef.current.length;

      if (remainingSlots <= 0) {
         showToast(acceptedFiles.length);
         return;
      }

      const candidates = acceptedFiles.slice(0, remainingSlots);
      const cutCount = acceptedFiles.length - candidates.length;
      if (cutCount > 0) showToast(cutCount);

      const validFiles: File[] = [];
      let rejectedSmall = false;
      await Promise.all(
         candidates.map(async file => {
            if (file.type.startsWith('image/')) {
               try {
                  const { w, h } = await getImageDimensions(file);
                  if (w < MIN_IMAGE_WIDTH || h < MIN_IMAGE_HEIGHT) {
                     rejectedSmall = true;
                     return;
                  }
               } catch {
                  return;
               }
            }
            validFiles.push(file);
         }),
      );

      if (rejectedSmall) {
         setTooSmallToast(true);
         if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
         toastTimerRef.current = setTimeout(() => {
            setFileLimitToast(null);
            setTooSmallToast(false);
         }, TOAST_DURATION);
      }

      if (validFiles.length === 0) return;

      const newFiles = validFiles.map(createPostMedia);
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
   }

   const { getRootProps, getInputProps, open } = useDropzone({
      onDrop,
      accept: isReel
         ? { 'video/*': ['.mp4', '.mov', '.webm'] }
         : {
              'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
              'video/*': ['.mp4', '.mov', '.webm'],
           },
      maxFiles: isReel ? 1 : MAX_FILES,
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
      setAspectRatio(isReel ? '9:16' : 'original');
      setCaption('');
      setLocation(null);
      setCollaborators([]);
      setPostSettings(DEFAULT_POST_SETTINGS);
      setIsDiscardOpen(false);
   };

   const requestClose = () => {
      if (isDiscardOpen) setIsDiscardOpen(false);
      else if (step === 'upload' || step === 'post-shared') close();
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
      <Dialog.Content
         {...stylex.props(styles.content)}
         onEscapeKeyDown={e => {
            e.preventDefault();
            requestClose();
         }}
         onInteractOutside={e => {
            e.preventDefault();
            requestClose();
         }}
      >
         <input {...getInputProps()} style={{ display: 'none' }} />
         {step === 'upload' && (
            <>
               <HiddenDialogDescription>Upload a photo or video</HiddenDialogDescription>
               <UploadStep
                  getRootProps={getRootProps}
                  open={open}
                  isDragActive={isDragActive}
                  elementType={isReel ? 'reel' : 'post'}
               />
            </>
         )}
         {step === 'crop' && (
            <>
               <HiddenDialogDescription>Crop your photo</HiddenDialogDescription>
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
                  isReel={isReel}
               />
            </>
         )}
         {step === 'edit' && (
            <>
               <HiddenDialogDescription>Edit your post</HiddenDialogDescription>
               <EditStep
                  files={files}
                  currentIndex={currentIndex}
                  onBack={() => setStep('crop')}
                  onNext={() => setStep('caption')}
                  onSelectIndex={setCurrentIndex}
                  onUpdateFile={handleUpdateFile}
                  aspectRatio={aspectRatio}
                  isReel={isReel}
               />
            </>
         )}
         {step === 'caption' && (
            <>
               <HiddenDialogDescription>Add caption and details</HiddenDialogDescription>
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
                  isReel={isReel}
               />
            </>
         )}
         {step === 'sharing' && (
            <>
               <HiddenDialogDescription>Sharing your post</HiddenDialogDescription>
               <SharingStep postData={postData} onDone={() => setStep('post-shared')} />
            </>
         )}
         {step === 'post-shared' && (
            <>
               <HiddenDialogDescription>Post shared</HiddenDialogDescription>
               <PostSharedStep onDone={close} />
            </>
         )}
         {isDiscardOpen && (
            <DiscardDialog onCancel={() => setIsDiscardOpen(false)} onConfirm={close} />
         )}
         {fileLimitToast !== null && (
            <div {...stylex.props(styles.toast)}>
               {isReel
                  ? 'You can only upload 1 video for a reel.'
                  : `${fileLimitToast} file${fileLimitToast > 1 ? 's' : ''} were not uploaded. You can only choose 10 or fewer files.`}
            </div>
         )}
         {tooSmallToast && (
            <div {...stylex.props(styles.toast)}>
               {`Image is too small. Minimum size is ${MIN_IMAGE_WIDTH}×${MIN_IMAGE_HEIGHT}px.`}
            </div>
         )}
      </Dialog.Content>
   );
}
