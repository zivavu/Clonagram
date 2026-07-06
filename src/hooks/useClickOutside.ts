import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
   onClose: () => void,
   enabled: boolean = true,
) {
   const ref = useRef<T>(null);

   useEffect(() => {
      if (!enabled) return;
      function handleMouseDown(e: MouseEvent) {
         const target = e.target as Node;
         if ((target as Element).closest?.('[role="dialog"]')) return;
         if (ref.current && !ref.current.contains(target)) {
            onClose();
         }
      }
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
   }, [enabled, onClose]);

   return ref;
}
