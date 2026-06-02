import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { Fragment } from 'react';
import { styles } from './index.stylex';

interface CommentTextProps {
   content: string;
}

export default function CommentText({ content }: CommentTextProps) {
   const parts: Array<{ text: string; offset: number }> = [];
   let offset = 0;
   for (const part of content.split(/(@\w+)/g)) {
      if (part) parts.push({ text: part, offset });
      offset += part.length;
   }

   return (
      <span {...stylex.props(styles.commentText)}>
         {parts.map(({ text, offset: key }) => {
            if (text.startsWith('@')) {
               const username = text.slice(1);
               return (
                  <Link
                     key={key}
                     href={`/profile/${username}`}
                     {...stylex.props(styles.mentionLink)}
                  >
                     {text}
                  </Link>
               );
            }
            return <Fragment key={key}>{text}</Fragment>;
         })}
      </span>
   );
}
