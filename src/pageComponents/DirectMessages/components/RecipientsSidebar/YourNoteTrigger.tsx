'use client';

import * as stylex from '@stylexjs/stylex';
import { useNewNoteModalStore } from '@/src/store/createModalStore';
import { styles } from './index.stylex';

export default function YourNoteTrigger({ note }: { note: string | null }) {
   const open = useNewNoteModalStore(s => s.open);

   return (
      <button type="button" onClick={open} {...stylex.props(styles.messageBubble)}>
         {note ?? 'Ask friends anything...'}
      </button>
   );
}
