'use client';

import * as stylex from '@stylexjs/stylex';
import EmojiPicker, { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { IoMicOutline } from 'react-icons/io5';
import { TbPhoto } from 'react-icons/tb';
import { toast } from '@/src/components/AppToast';
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
const PICKER_CLASS = 'clonagram-emoji-picker';

const pickerOverrideCSS = `
   .epr-dark-theme.${PICKER_CLASS} {
      --epr-search-input-bg-color: rgb(33, 35, 40);
      --epr-search-input-bg-color-active: rgb(33, 35, 40);
      --epr-search-border-color: rgb(33, 35, 40);
      --epr-search-border-color-active: rgb(33, 35, 40);
   }
`;

function extractText(div: HTMLElement): string {
   let text = '';
   for (const node of div.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
         text += node.textContent ?? '';
      } else if (node instanceof HTMLImageElement) {
         text += node.dataset.emoji ?? '';
      } else if (node instanceof HTMLElement) {
         text += extractText(node);
      }
   }
   return text;
}

const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(function MessageInput(
   { onSend, onSendSticker, onSendImages }: MessageInputProps,
   ref,
) {
   const isDark = useThemeStore(s => s.isDark);
   const [sending, setSending] = useState(false);
   const [pickerOpen, setPickerOpen] = useState(false);
   const [isEmpty, setIsEmpty] = useState(true);
   const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
   const editorRef = useRef<HTMLDivElement>(null);
   const pickerContainerRef = useRef<HTMLDivElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   useImperativeHandle(ref, () => ({ addFiles: addImageFiles }));

   useEffect(() => {
      if (!pickerOpen) return;
      function handleClickOutside(e: MouseEvent) {
         if (pickerContainerRef.current && !pickerContainerRef.current.contains(e.target as Node)) {
            setPickerOpen(false);
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [pickerOpen]);

   function addImageFiles(files: File[]) {
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      if (!imageFiles.length) return;
      const newItems: PendingImage[] = imageFiles.map(file => ({
         file,
         previewUrl: URL.createObjectURL(file),
      }));
      setPendingImages(prev => [...prev, ...newItems]);
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

      const text = extractText(div);
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

   function handleEmojiClick(emojiData: EmojiClickData) {
      const div = editorRef.current;
      if (!div) return;

      const img = document.createElement('img');
      img.src = emojiData.imageUrl;
      img.dataset.emoji = emojiData.emoji;
      img.alt = emojiData.emoji;
      img.style.cssText = 'width:18px;height:18px;vertical-align:middle;display:inline-block;';

      div.focus();
      const sel = window.getSelection();
      if (sel?.rangeCount) {
         const range = sel.getRangeAt(0);
         range.deleteContents();
         range.insertNode(img);
         range.setStartAfter(img);
         range.collapse(true);
         sel.removeAllRanges();
         sel.addRange(range);
      } else {
         div.appendChild(img);
      }

      setIsEmpty(false);
   }

   function handleInput() {
      const div = editorRef.current;
      if (!div) return;
      const text = extractText(div);
      if (text.length > MAX_LENGTH) {
         toast('Message is too long');
         const trimmed = text.slice(0, MAX_LENGTH);
         div.innerHTML = '';
         div.textContent = trimmed;
      }
      setIsEmpty(!(div.textContent?.trim() || div.querySelector('img')));
   }

   function handleBeforeInput(e: React.FormEvent<HTMLDivElement>) {
      const div = editorRef.current;
      if (!div) return;
      const text = extractText(div);
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
                           onEmojiClick={handleEmojiClick}
                           theme={isDark ? Theme.DARK : Theme.LIGHT}
                           emojiStyle={EmojiStyle.FACEBOOK}
                           className={PICKER_CLASS}
                           width={400}
                           height={400}
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
                     onBeforeInput={handleBeforeInput}
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
