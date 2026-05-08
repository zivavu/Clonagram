'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloseOutline, IoImagesOutline } from 'react-icons/io5';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import CropStep from './components/CropStep';
import { styles } from './index.stylex';
import type { SelectedFile, Step } from './types';

const MAX_FILES = 10;

export default function CreatePostModal() {
   const { isOpen, close } = useCreatePostModalStore();
   const [step, setStep] = useState<Step>('upload');
   const [files, setFiles] = useState<SelectedFile[]>([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isDragActive, setIsDragActive] = useState(false);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const newFiles: SelectedFile[] = acceptedFiles.map(file => ({
         file,
         preview: URL.createObjectURL(file),
         aspectRatio: 'original',
         zoom: 1,
         panX: 0,
         panY: 0,
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
   };

   return (
      <Dialog.Root open={isOpen} onOpenChange={handleClose}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={handleClose}>
               <input {...getInputProps()} style={{ display: 'none' }} />
               {step === 'upload' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>
                        Upload photos and videos to create a new post
                     </Dialog.Description>
                     <div {...stylex.props(styles.header)}>
                        <div style={{ width: 30 }} />
                        <Dialog.Title {...stylex.props(styles.title)}>Create new post</Dialog.Title>
                        <Dialog.Close asChild>
                           <button {...stylex.props(styles.closeButton)} aria-label="Close">
                              <IoCloseOutline style={{ fontSize: 30 }} />
                           </button>
                        </Dialog.Close>
                     </div>
                     <div {...getRootProps()} {...stylex.props(styles.dropZone, isDragActive && styles.dropZoneActive)}>
                        <IoImagesOutline style={{ fontSize: 96, color: 'rgb(168, 168, 168)' }} />
                        <p {...stylex.props(styles.dropText)}>Drag photos and videos here</p>
                        <button type="button" {...stylex.props(styles.selectButton)} onClick={open}>
                           Select from computer
                        </button>
                     </div>
                  </>
               )}
               {step === 'crop' && (
                  <>
                     <Dialog.Description style={{ display: 'none' }}>Crop your photo</Dialog.Description>
                     <CropStep
                        files={files}
                        currentIndex={currentIndex}
                        onBack={handleBackToUpload}
                        onNext={() => {}}
                        onSelectIndex={setCurrentIndex}
                        onRemoveFile={handleRemoveFile}
                        onUpdateFile={handleUpdateFile}
                        onAddFiles={open}
                     />
                  </>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
