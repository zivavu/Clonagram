import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
   onClose: () => void,
   enabled: boolean = true,
   ignoreRef?: React.RefObject<HTMLElement | null>,
) {
   const ref = useRef<T>(null);

   useEffect(() => {
      if (!enabled) return;
      function handleMouseDown(e: MouseEvent) {
         if (ignoreRef?.current?.contains(e.target as Node)) return;
         if (ref.current && !ref.current.contains(e.target as Node)) {
            onClose();
         }
      }
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
   }, [enabled, onClose, ignoreRef]);

   return ref;
}
