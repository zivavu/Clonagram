'use client';

import { Emoji, EmojiStyle } from 'emoji-picker-react';

const emojiRegex = /\p{Extended_Pictographic}/u;
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

interface Segment {
   type: 'text' | 'emoji';
   key: string;
   value?: string;
   unified?: string;
}

function segmentText(text: string): Segment[] {
   const segments: Segment[] = [];
   let currentText = '';
   let idx = 0;

   for (const { segment } of segmenter.segment(text)) {
      if (emojiRegex.test(segment)) {
         if (currentText) {
            segments.push({ type: 'text', key: `t${idx++}`, value: currentText });
            currentText = '';
         }
         const unified = [...segment]
            .map(c => c.codePointAt(0)?.toString(16) ?? '')
            .filter(Boolean)
            .join('-');
         segments.push({ type: 'emoji', key: `e${idx++}`, unified });
      } else {
         currentText += segment;
      }
   }

   if (currentText) segments.push({ type: 'text', key: `t${idx}`, value: currentText });
   return segments;
}

function isSingleEmoji(text: string): boolean {
   const trimmed = text.trim();
   const segments = segmentText(trimmed);
   return segments.length === 1 && segments[0].type === 'emoji';
}

export default function EmojiText({
   content,
   size = 18,
   bigIfSingle = false,
}: {
   content: string;
   size?: number;
   bigIfSingle?: boolean;
}) {
   const segments = segmentText(content);
   const isSingle = isSingleEmoji(content);
   const emojiSize = bigIfSingle && isSingle ? 48 : size;

   return (
      <>
         {segments.map(seg =>
            seg.type === 'text' ? (
               seg.value
            ) : (
               <span key={seg.key} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <Emoji
                     unified={seg.unified ?? ''}
                     emojiStyle={EmojiStyle.FACEBOOK}
                     size={emojiSize}
                  />
               </span>
            ),
         )}
      </>
   );
}
