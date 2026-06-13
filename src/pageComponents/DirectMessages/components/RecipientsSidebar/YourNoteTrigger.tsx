'use client';

import NoteBubble from '@/src/components/NoteBubble';
import { useNewNoteModalStore } from '@/src/store/createModalStore';

export default function YourNoteTrigger({ note }: { note: string | null }) {
   const open = useNewNoteModalStore(s => s.open);

   return <NoteBubble content={note ?? 'Ask friends anything...'} onClick={open} tail="dot" />;
}
