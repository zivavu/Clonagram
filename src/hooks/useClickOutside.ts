import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
   onClose: () => void,
   enabled: boolean = true,
) {
   const ref = useRef<T>(null);

   useEffect(() => {
      if (!enabled) return;
      function handleMouseDown(e: MouseEvent) {
         if (ref.current && !ref.current.contains(e.target as Node)) {
            onClose();
         }
      }
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
   }, [enabled, onClose]);

   return ref;
}
