'use client';

import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface NoteBubbleProps {
   content: string;
   onClick?: () => void;
   size?: 'sm' | 'md';
   tail?: 'dot';
}

export default function NoteBubble({ content, onClick, size = 'md', tail }: NoteBubbleProps) {
   const bubbleProps = [
      styles.noteBubble,
      styles[size],
      tail === 'dot' && styles.tailDot,
      onClick ? styles.clickable : styles.noPointerEvents,
   ];

   const inner = <span {...stylex.props(styles.text)}>{content}</span>;

   if (onClick) {
      return (
         <button type="button" {...stylex.props(...bubbleProps)} onClick={onClick}>
            {inner}
         </button>
      );
   }

   return <div {...stylex.props(...bubbleProps)}>{inner}</div>;
}
