'use client';

import { Emoji, EmojiStyle } from 'emoji-picker-react';

type Segment =
   | { type: 'text'; key: string; value: string }
   | { type: 'emoji'; key: string; unified: string };

const emojiRegex = /\p{Extended_Pictographic}/u;
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

function segmentMessage(text: string): Segment[] {
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

export default function MessageText({ content }: { content: string }) {
   const segments = segmentMessage(content);
   return (
      <>
         {segments.map(seg =>
            seg.type === 'text' ? (
               seg.value
            ) : (
               <span key={seg.key} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <Emoji unified={seg.unified} emojiStyle={EmojiStyle.FACEBOOK} size={18} />
               </span>
            ),
         )}
      </>
   );
}
