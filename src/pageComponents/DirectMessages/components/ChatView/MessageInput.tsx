'use client';

import * as stylex from '@stylexjs/stylex';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { IoMicOutline } from 'react-icons/io5';
import { TbPhoto } from 'react-icons/tb';
import { toast } from '@/src/components/AppToast';
import { PICKER_CLASS, pickerOverrideCSS, useEmojiEditor } from '@/src/hooks/useEmojiEditor';
import { useThemeStore } from '@/src/store/useThemeStore';
import { radius } from '../../../../styles/tokens.stylex';
import { styles } from '../../index.stylex';
import ImagePreviewStrip, { type PendingImage } from './ImagePreviewStrip';

const StickerPicker = dynamic(() => import('./StickerPicker'), { ssr: false });

interface MessageInputProps {
   onSend: (text: string) => Promise<void>;
   onSendSticker: (url: string) => Promise<void>;
   onSendImages: (files: File[]) => Promise<void>;
}

export interface MessageInputHandle {
   addFiles: (files: File[]) => void;
}

const MAX_LENGTH = 1000;
const MAX_IMAGES = 10;

const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(function MessageInput(
   { onSend, onSendSticker, onSendImages }: MessageInputProps,
   ref,
) {
   const isDark = useThemeStore(s => s.isDark);
   const [sending, setSending] = useState(false);
   const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const {
      editorRef,
      isEmpty,
      getText,
      insertEmoji,
      pickerOpen,
      setPickerOpen,
      pickerContainerRef,
      setIsEmpty,
   } = useEmojiEditor(MAX_LENGTH);

   useImperativeHandle(ref, () => ({ addFiles: addImageFiles }));

   function addImageFiles(files: File[]) {
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      if (!imageFiles.length) return;
      setPendingImages(prev => {
         const availableSlots = Math.max(0, MAX_IMAGES - prev.length);
         if (availableSlots === 0) {
            toast(`You can only send up to ${MAX_IMAGES} images`);
            return prev;
         }
         const toAdd = imageFiles.slice(0, availableSlots);
         if (toAdd.length < imageFiles.length) {
            toast(`You can only send up to ${MAX_IMAGES} images`);
         }
         const newItems: PendingImage[] = toAdd.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
         }));
         return [...prev, ...newItems];
      });
   }

   function removeImage(index: number) {
      setPendingImages(prev => {
         URL.revokeObjectURL(prev[index].previewUrl);
         return prev.filter((_, i) => i !== index);
      });
   }

   async function handleSend() {
      const div = editorRef.current;
      if (!div || sending) return;
      if (pendingImages.length === 0 && isEmpty) return;

      const text = getText();
      if (text.length > MAX_LENGTH) {
         toast('Message is too long');
         return;
      }

      setSending(true);
      const imagesToSend = pendingImages;
      setPendingImages([]);
      div.innerHTML = '';
      setIsEmpty(true);

      try {
         if (text.trim()) await onSend(text);
         if (imagesToSend.length) {
            await onSendImages(imagesToSend.map(i => i.file));
            for (const img of imagesToSend) URL.revokeObjectURL(img.previewUrl);
         }
      } finally {
         setSending(false);
      }
   }

   function handleInput() {
      const div = editorRef.current;
      if (!div) return;
      const text = getText();
      if (text.length > MAX_LENGTH) {
         toast('Message is too long');
         const trimmed = text.slice(0, MAX_LENGTH);
         div.innerHTML = '';
         div.textContent = trimmed;
      }
      setIsEmpty(!(div.textContent?.trim() || div.querySelector('img')));
   }

   function handleBeforeInputWithToast(e: React.FormEvent<HTMLDivElement>) {
      const div = editorRef.current;
      if (!div) return;
      const text = getText();
      if (text.length >= MAX_LENGTH) {
         e.preventDefault();
         toast('Message is too long');
      }
   }

   function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
      const imageFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
      if (imageFiles.length) {
         e.preventDefault();
         addImageFiles(imageFiles);
      }
   }

   function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      addImageFiles(Array.from(e.target.files ?? []));
      e.target.value = '';
   }

   const hasContent = !isEmpty || pendingImages.length > 0;

   return (
      <div {...stylex.props(styles.inputContainer)}>
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
         />
         <div {...stylex.props(styles.inputWrapper)}>
            {pendingImages.length > 0 && (
               <ImagePreviewStrip
                  images={pendingImages}
                  onRemove={removeImage}
                  onAdd={addImageFiles}
               />
            )}
            <div {...stylex.props(styles.inputRow)}>
               <div ref={pickerContainerRef} style={{ position: 'relative', display: 'flex' }}>
                  <AiOutlineSmile
                     {...stylex.props(styles.inputIcon)}
                     onClick={() => setPickerOpen(open => !open)}
                  />
                  {pickerOpen && (
                     <div
                        style={{
                           position: 'absolute',
                           bottom: '150%',
                           left: 0,
                           transform: 'translateX(-50%)',
                           zIndex: 100,
                           marginBottom: 8,
                           borderRadius: radius.sm,
                           overflow: 'hidden',
                           boxShadow: '0 2px 8px 1px rgba(0, 0, 0, 0.2)',
                        }}
                     >
                        <style href="clonagram-emoji-picker-override" precedence="default">
                           {pickerOverrideCSS}
                        </style>
                        <EmojiPicker
                           onEmojiClick={insertEmoji}
                           theme={isDark ? Theme.DARK : Theme.LIGHT}
                           emojiStyle={EmojiStyle.FACEBOOK}
                           className={PICKER_CLASS}
                           width={320}
                           height={320}
                           previewConfig={{ showPreview: false }}
                        />
                     </div>
                  )}
               </div>
               <div {...stylex.props(styles.inputFieldWrapper)}>
                  {isEmpty && <span {...stylex.props(styles.inputPlaceholder)}>Message...</span>}
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: contenteditable is inherently interactive */}
                  <div
                     ref={editorRef}
                     contentEditable
                     suppressContentEditableWarning
                     {...stylex.props(styles.inputField)}
                     onInput={handleInput}
                     onBeforeInput={handleBeforeInputWithToast}
                     onPaste={handlePaste}
                     onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSend();
                        }
                        if (e.key === 'Escape') setPickerOpen(false);
                     }}
                  />
               </div>
               {hasContent ? (
                  <button
                     type="button"
                     {...stylex.props(styles.sendButton)}
                     onClick={handleSend}
                     disabled={sending}
                  >
                     Send
                  </button>
               ) : (
                  <>
                     <IoMicOutline {...stylex.props(styles.inputIcon)} />
                     <TbPhoto
                        {...stylex.props(styles.inputIcon)}
                        onClick={() => fileInputRef.current?.click()}
                     />
                     <StickerPicker onSelect={onSendSticker} />
                  </>
               )}
            </div>
         </div>
      </div>
   );
});

export default MessageInput;
