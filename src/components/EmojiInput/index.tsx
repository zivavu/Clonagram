'use client';

import * as stylex from '@stylexjs/stylex';
import EmojiPicker, { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { FaRegFaceSmile } from 'react-icons/fa6';
import { useClickOutside } from '@/src/hooks/useClickOutside';
import { useThemeStore } from '@/src/store/useThemeStore';
import { styles } from './index.stylex';

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

export interface EmojiInputRef {
   getText: () => string;
   setText: (text: string) => void;
   clear: () => void;
   focus: () => void;
}

interface EmojiInputProps {
   placeholder?: string;
   maxLength?: number;
   onSubmit?: () => void;
}

const EmojiInput = forwardRef<EmojiInputRef, EmojiInputProps>(function EmojiInput(
   { placeholder, maxLength, onSubmit }: EmojiInputProps,
   ref,
) {
   const isDark = useThemeStore(s => s.isDark);
   const [pickerOpen, setPickerOpen] = useState(false);
   const [isEmpty, setIsEmpty] = useState(true);
   const editorRef = useRef<HTMLDivElement>(null);
   const pickerContainerRef = useClickOutside<HTMLDivElement>(
      () => setPickerOpen(false),
      pickerOpen,
   );

   useImperativeHandle(ref, () => ({
      getText: () => {
         const div = editorRef.current;
         return div ? extractText(div) : '';
      },
      setText: (text: string) => {
         const div = editorRef.current;
         if (!div) return;
         div.textContent = text;
         setIsEmpty(!text.trim());
      },
      clear: () => {
         const div = editorRef.current;
         if (!div) return;
         div.innerHTML = '';
         setIsEmpty(true);
      },
      focus: () => {
         editorRef.current?.focus();
      },
   }));

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
      if (maxLength && text.length > maxLength) {
         const trimmed = text.slice(0, maxLength);
         div.innerHTML = '';
         div.textContent = trimmed;
      }
      setIsEmpty(!text.trim());
   }

   function handleBeforeInput(e: React.FormEvent<HTMLDivElement>) {
      const div = editorRef.current;
      if (!div || !maxLength) return;
      const text = extractText(div);
      if (text.length >= maxLength) {
         e.preventDefault();
      }
   }

   function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         onSubmit?.();
      }
      if (e.key === 'Escape') {
         setPickerOpen(false);
      }
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div ref={pickerContainerRef} {...stylex.props(styles.emojiWrapper)}>
            <FaRegFaceSmile
               {...stylex.props(styles.emojiIcon)}
               onClick={() => setPickerOpen(open => !open)}
            />
            {pickerOpen && (
               <div {...stylex.props(styles.pickerWrapper)}>
                  <style href="clonagram-emoji-picker-override" precedence="default">
                     {pickerOverrideCSS}
                  </style>
                  <EmojiPicker
                     onEmojiClick={handleEmojiClick}
                     theme={isDark ? Theme.DARK : Theme.LIGHT}
                     emojiStyle={EmojiStyle.FACEBOOK}
                     className={PICKER_CLASS}
                     width={280}
                     height={320}
                     previewConfig={{ showPreview: false }}
                  />
               </div>
            )}
         </div>
         <div {...stylex.props(styles.inputWrapper)}>
            {isEmpty && placeholder && (
               <span {...stylex.props(styles.placeholder)}>{placeholder}</span>
            )}
            {/* biome-ignore lint/a11y/noStaticElementInteractions: contenteditable is inherently interactive */}
            <div
               ref={editorRef}
               contentEditable
               suppressContentEditableWarning
               {...stylex.props(styles.input)}
               onInput={handleInput}
               onBeforeInput={handleBeforeInput}
               onKeyDown={handleKeyDown}
            />
         </div>
      </div>
   );
});

export default EmojiInput;
