import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { Fragment } from 'react';
import { styles } from './index.stylex';

interface CommentTextProps {
   content: string;
}

export default function CommentText({ content }: CommentTextProps) {
   const parts = content.split(/(@\w+)/g);
   let offset = 0;

   return (
      <span {...stylex.props(styles.commentText)}>
         {parts.map(part => {
            const key = offset;
            offset += part.length;
            if (part.startsWith('@')) {
               const username = part.slice(1);
               return (
                  <Link
                     key={key}
                     href={`/profile/${username}`}
                     {...stylex.props(styles.mentionLink)}
                  >
                     {part}
                  </Link>
               );
            }
            return <Fragment key={key}>{part}</Fragment>;
         })}
      </span>
   );
}
