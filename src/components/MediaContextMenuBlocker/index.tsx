'use client';

import { useEffect } from 'react';

export default function MediaContextMenuBlocker() {
   useEffect(() => {
      if (!window.matchMedia('(pointer: coarse)').matches) return;

      function blockMediaContextMenu(event: MouseEvent) {
         const target = event.target as HTMLElement | null;
         if (target?.closest('img, video, picture')) {
            event.preventDefault();
         }
      }

      document.addEventListener('contextmenu', blockMediaContextMenu);
      return () => document.removeEventListener('contextmenu', blockMediaContextMenu);
   }, []);

   return null;
}
