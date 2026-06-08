'use client';

import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface NoteBubbleProps {
   content: string;
   onClick?: () => void;
   size?: 'sm' | 'md';
}

export default function NoteBubble({ content, onClick, size = 'sm' }: NoteBubbleProps) {
   const styleProps = [
      styles.noteBubble,
      styles[size],
      onClick ? styles.clickable : styles.noPointerEvents,
   ];

   if (onClick) {
      return (
         <button type="button" {...stylex.props(...styleProps)} onClick={onClick}>
            {content}
         </button>
      );
   }

   return <div {...stylex.props(...styleProps)}>{content}</div>;
}
