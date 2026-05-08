import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import type { MessageThread } from '@/src/mocks/messageThreads';
import { formatTimestamp } from '@/src/utils/formatters';
import { getLastMessagePreview } from '@/src/utils/messages';
import { styles } from './index.stylex';

export function ThreadItem({ thread, href, unread }: { thread: MessageThread; href: string; unread?: boolean }) {
   const participant = thread.participants[0];
   const displayName = participant.name || participant.username;

   return (
      <Link href={href} {...stylex.props(styles.threadItem)}>
         <Image
            src={participant.avatarUrl}
            alt={displayName}
            width={56}
            height={56}
            {...stylex.props(styles.threadAvatar)}
         />
         <div {...stylex.props(styles.threadContent)}>
            <span {...stylex.props(styles.threadName, unread && styles.threadNameUnread)}>{displayName}</span>
            <div {...stylex.props(styles.threadPreviewRow)}>
               <span {...stylex.props(styles.threadPreview, unread && styles.threadPreviewUnread)}>
                  {getLastMessagePreview(thread)}
               </span>
               <span {...stylex.props(styles.threadTimestamp)}>
                  {' · '}
                  {formatTimestamp(thread.lastMessageAt)}
               </span>
            </div>
         </div>
         {unread && <div {...stylex.props(styles.unreadDot)} />}
      </Link>
   );
}
