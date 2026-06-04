'use client';

import * as stylex from '@stylexjs/stylex';
import EmojiPicker, { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { TbPhoto } from 'react-icons/tb';
import { useThemeStore } from '@/src/store/useThemeStore';
import { radius } from '../../../../styles/tokens.stylex';
import { styles } from '../../index.stylex';

interface MessageInputProps {
   onSend: (text: string) => Promise<void>;
}

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

export default function MessageInput({ onSend }: MessageInputProps) {
   const isDark = useThemeStore(s => s.isDark);
   const [sending, setSending] = useState(false);
   const [pickerOpen, setPickerOpen] = useState(false);
   const [isEmpty, setIsEmpty] = useState(true);
   const editorRef = useRef<HTMLDivElement>(null);
   const pickerContainerRef = useRef<HTMLDivElement>(null);

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

   async function handleSend() {
      const div = editorRef.current;
      if (!div || sending) return;
      const text = extractText(div);
      if (!text.trim()) return;
      setSending(true);
      div.innerHTML = '';
      setIsEmpty(true);
      try {
         await onSend(text);
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
      setIsEmpty(!(div?.textContent?.trim() || div?.querySelector('img')));
   }

   return (
      <div {...stylex.props(styles.inputContainer)}>
         <div {...stylex.props(styles.inputWrapper)}>
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
                  onKeyDown={e => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                     }
                     if (e.key === 'Escape') setPickerOpen(false);
                  }}
               />
            </div>
            <IoMicOutline {...stylex.props(styles.inputIcon)} />
            <TbPhoto {...stylex.props(styles.inputIcon)} />
            <LuSticker {...stylex.props(styles.inputIcon)} />
         </div>
      </div>
   );
}
