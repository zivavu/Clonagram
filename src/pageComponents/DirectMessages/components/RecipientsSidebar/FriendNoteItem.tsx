import * as stylex from '@stylexjs/stylex';
import NoteBubble from '@/src/components/NoteBubble';
import UserAvatar from '@/src/components/UserAvatar';
import type { NoteEntry } from '@/src/actions/notes/getNotesForFeed';
import { styles } from './index.stylex';

export default function FriendNoteItem({ entry }: { entry: NoteEntry }) {
   return (
      <div {...stylex.props(styles.noteItem)}>
         <NoteBubble content={entry.content} tail="dot" />
         <UserAvatar
            src={entry.avatarUrl || null}
            alt={entry.username}
            size={74}
            username={entry.username}
            userId={entry.userId}
            href={`/${entry.username}`}
            useHoverCard={false}
         />
         <span {...stylex.props(styles.noteItemLabel)}>{entry.username}</span>
      </div>
   );
}
