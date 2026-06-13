'use client';

import type { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@/src/hooks/useClickOutside';

export const PICKER_CLASS = 'clonagram-emoji-picker';

export const pickerOverrideCSS = `
   .epr-dark-theme.${PICKER_CLASS} {
      --epr-search-input-bg-color: rgb(33, 35, 40);
      --epr-search-input-bg-color-active: rgb(33, 35, 40);
      --epr-search-border-color: rgb(33, 35, 40);
      --epr-search-border-color-active: rgb(33, 35, 40);
   }
`;

export function extractText(div: HTMLElement) {
   return div.textContent ?? '';
}

export function useEmojiEditor(maxLength?: number) {
   const [pickerOpen, setPickerOpen] = useState(false);
   const [isEmpty, setIsEmpty] = useState(true);
   const editorRef = useRef<HTMLDivElement>(null);
   const savedRangeRef = useRef<Range | null>(null);

   useEffect(() => {
      function handleSelectionChange() {
         const sel = window.getSelection();
         if (sel?.rangeCount && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
            savedRangeRef.current = sel.getRangeAt(0).cloneRange();
         }
      }
      document.addEventListener('selectionchange', handleSelectionChange);
      return () => document.removeEventListener('selectionchange', handleSelectionChange);
   }, []);

   const pickerContainerRef = useClickOutside<HTMLDivElement>(
      () => setPickerOpen(false),
      pickerOpen,
   );

   function getText() {
      const div = editorRef.current;
      return div ? extractText(div) : '';
   }

   function setText(text: string) {
      const div = editorRef.current;
      if (!div) return;
      div.textContent = text;
      setIsEmpty(!text.trim());
   }

   function clear() {
      const div = editorRef.current;
      if (!div) return;
      div.innerHTML = '';
      setIsEmpty(true);
   }

   function focus() {
      editorRef.current?.focus();
   }

   function insertEmoji(emojiData: EmojiClickData) {
      const div = editorRef.current;
      if (!div) return;

      const node = document.createTextNode(emojiData.emoji);

      div.focus();
      const sel = window.getSelection();

      if (savedRangeRef.current) {
         sel?.removeAllRanges();
         sel?.addRange(savedRangeRef.current);
      }

      if (sel?.rangeCount) {
         const range = sel.getRangeAt(0);
         range.deleteContents();
         range.insertNode(node);
         range.setStartAfter(node);
         range.collapse(true);
         sel.removeAllRanges();
         sel.addRange(range);
      } else {
         div.appendChild(node);
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

   return {
      editorRef,
      isEmpty,
      getText,
      setText,
      clear,
      focus,
      insertEmoji,
      pickerOpen,
      setPickerOpen,
      pickerContainerRef,
      handleInput,
      handleBeforeInput,
      setIsEmpty,
   };
}
