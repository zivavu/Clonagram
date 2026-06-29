'use client';

import * as stylex from '@stylexjs/stylex';
import { useSelectedLayoutSegment } from 'next/navigation';
import { type ReactNode, Suspense } from 'react';
import { styles } from '../../index.stylex';
import ChatViewSkeleton from '../ChatViewSkeleton';

interface DirectShellProps {
   sidebar: ReactNode;
   children: ReactNode;
}

export default function DirectShell({ sidebar, children }: DirectShellProps) {
   const segment = useSelectedLayoutSegment();
   const isChatSelected = segment !== null;

   return (
      <div {...stylex.props(styles.root)}>
         <div
            {...stylex.props(
               styles.sidebarContainer,
               isChatSelected && styles.sidebarContainerHidden,
            )}
         >
            {sidebar}
         </div>
         <div
            {...stylex.props(styles.chatContainer, !isChatSelected && styles.chatContainerHidden)}
         >
            <Suspense fallback={<ChatViewSkeleton />}>{children}</Suspense>
         </div>
      </div>
   );
}
