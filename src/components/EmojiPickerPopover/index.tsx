'use client';

import { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { PICKER_CLASS, pickerOverrideCSS } from '@/src/hooks/useEmojiEditor';
import { useThemeStore } from '@/src/store/useThemeStore';

const EmojiPicker = dynamic(() => import('emoji-picker-react').then(m => m.default), {
   ssr: false,
});

interface EmojiPickerPopoverProps {
   onEmojiClick: (data: EmojiClickData) => void;
   width?: number;
}

export default function EmojiPickerPopover({ onEmojiClick, width = 280 }: EmojiPickerPopoverProps) {
   const isDark = useThemeStore(s => s.isDark);
   return (
      <>
         <style href="clonagram-emoji-picker-override" precedence="default">
            {pickerOverrideCSS}
         </style>
         <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={isDark ? Theme.DARK : Theme.LIGHT}
            emojiStyle={EmojiStyle.FACEBOOK}
            className={PICKER_CLASS}
            width={width}
            height={320}
            previewConfig={{ showPreview: false }}
         />
      </>
   );
}
