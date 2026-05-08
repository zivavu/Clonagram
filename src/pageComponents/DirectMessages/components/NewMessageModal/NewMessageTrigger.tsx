'use client';

import { useNewMessageModalStore } from '@/src/store/useNewMessageModalStore';

interface NewMessageTriggerProps {
   children: React.ReactNode;
   styleProps?: { className?: string; style?: React.CSSProperties };
}

export default function NewMessageTrigger({ children, styleProps }: NewMessageTriggerProps) {
   const open = useNewMessageModalStore(state => state.open);

   return (
      <button type="button" onClick={open} {...(styleProps || {})}>
         {children}
      </button>
   );
}
