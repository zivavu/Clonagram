'use client';

import * as stylex from '@stylexjs/stylex';
import EmojiPicker, { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { TbPhoto } from 'react-icons/tb';
import { sendMessage } from '@/src/actions/dm/sendMessage';
import { useThemeStore } from '@/src/store/useThemeStore';
import { radius } from '../../../../styles/tokens.stylex';
import { styles } from '../../index.stylex';

interface MessageInputProps {
   conversationId: string;
   onSent: () => void;
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

export default function MessageInput({ conversationId, onSent }: MessageInputProps) {
   const isDark = useThemeStore(s => s.isDark);
   const [text, setText] = useState('');
   const [sending, setSending] = useState(false);
   const [pickerOpen, setPickerOpen] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);
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
      if (!text.trim() || sending) return;
      setSending(true);
      try {
         await sendMessage(conversationId, text);
         setText('');
         onSent();
      } finally {
         setSending(false);
      }
   }

   function handleEmojiClick(emojiData: EmojiClickData) {
      const input = inputRef.current;
      if (!input) {
         setText(prev => prev + emojiData.emoji);
         return;
      }
      const start = input.selectionStart ?? text.length;
      const end = input.selectionEnd ?? text.length;
      const newText = text.slice(0, start) + emojiData.emoji + text.slice(end);
      setText(newText);
      requestAnimationFrame(() => {
         input.focus();
         const pos = start + emojiData.emoji.length;
         input.setSelectionRange(pos, pos);
      });
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
            <input
               ref={inputRef}
               {...stylex.props(styles.inputField)}
               type="text"
               placeholder="Message..."
               value={text}
               onChange={e => setText(e.target.value)}
               onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                  }
                  if (e.key === 'Escape') setPickerOpen(false);
               }}
               disabled={sending}
            />
            <IoMicOutline {...stylex.props(styles.inputIcon)} />
            <TbPhoto {...stylex.props(styles.inputIcon)} />
            <LuSticker {...stylex.props(styles.inputIcon)} />
         </div>
      </div>
   );
}
