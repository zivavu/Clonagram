'use client';

import EmojiText from '@/src/components/EmojiText';

export default function MessageText({ content }: { content: string }) {
   return <EmojiText content={content} size={18} bigIfSingle />;
}
