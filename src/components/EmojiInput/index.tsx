'use client';

import * as stylex from '@stylexjs/stylex';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { forwardRef, useImperativeHandle } from 'react';
import { FaRegFaceSmile } from 'react-icons/fa6';
import { PICKER_CLASS, pickerOverrideCSS, useEmojiEditor } from '@/src/hooks/useEmojiEditor';
import { useThemeStore } from '@/src/store/useThemeStore';
import { styles } from './index.stylex';

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
   const {
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
   } = useEmojiEditor(maxLength);

   useImperativeHandle(ref, () => ({ getText, setText, clear, focus }));

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
                     onEmojiClick={insertEmoji}
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
