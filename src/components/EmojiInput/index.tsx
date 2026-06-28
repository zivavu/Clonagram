'use client';

import * as stylex from '@stylexjs/stylex';
import { forwardRef, useImperativeHandle } from 'react';
import { FaRegFaceSmile } from 'react-icons/fa6';
import EmojiPickerPopover from '@/src/components/EmojiPickerPopover';
import { useEmojiEditor } from '@/src/hooks/useEmojiEditor';
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
            <button type="button" onClick={() => setPickerOpen(open => !open)}>
               <FaRegFaceSmile {...stylex.props(styles.emojiIcon)} />
            </button>
            {pickerOpen && (
               <div {...stylex.props(styles.pickerWrapper)}>
                  <EmojiPickerPopover onEmojiClick={insertEmoji} width={280} />
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
