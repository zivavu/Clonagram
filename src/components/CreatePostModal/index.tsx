'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import CropStep from './components/CropStep';
import EditStep from './components/EditStep';
import UploadStep from './components/UploadStep';
import { styles } from './index.stylex';
import type { AspectRatio, SelectedFile, Step } from './types';

const MAX_FILES = 10;

export default function CreatePostModal() {
   const { isOpen, close } = useCreatePostModalStore();
   const [step, setStep] = useState<Step>('upload');
   const [files, setFiles] = useState<SelectedFile[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isDragActive, setIsDragActive] = useState(false);
   const [caption, setCaption] = useState('');
   const [aspectRatio, setAspectRatio] = useState<AspectRatio>('original');

   const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const newFiles: SelectedFile[] = acceptedFiles.map(file => ({
         file,
         preview: URL.createObjectURL(file),
         zoom: 1,
         panX: 0,
         panY: 0,
         filterPreset: 'Original',
         adjustments: { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 },
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

   const handleClose = () => {
      for (const f of files) {
         URL.revokeObjectURL(f.preview);
      }
      setFiles([]);
      setCurrentIndex(0);
      setStep('upload');
      setCaption('');
      setAspectRatio('original');
      close();
   };

   const handleUpdateFile = (index: number, updates: Partial<SelectedFile>) => {
      setFiles(prev => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)));
   };

   const handleRemoveFile = (index: number) => {
      setFiles(prev => {
         const next = prev.filter((_, i) => i !== index);
         if (next.length === 0) {
            setStep('upload');
         }
         if (currentIndex >= next.length && next.length > 0) {
            setCurrentIndex(next.length - 1);
         }
         return next;
      });
   };

   const handleBackToUpload = () => {
      for (const f of files) {
         URL.revokeObjectURL(f.preview);
      }
      setFiles([]);
      setCurrentIndex(0);
      setStep('upload');
      setAspectRatio('original');
   };

   return (
      <Dialog.Root open={isOpen} onOpenChange={handleClose}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={handleClose}>
               <input {...getInputProps()} style={{ display: 'none' }} />
               {step === 'upload' && (
                  <UploadStep
                     getRootProps={getRootProps}
                     open={open}
                     isDragActive={isDragActive}
                     onClose={handleClose}
                  />
               )}
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
                        onSelectIndex={setCurrentIndex}
                        onUpdateFile={handleUpdateFile}
                        aspectRatio={aspectRatio}
                     />
                  </>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
