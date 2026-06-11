import { useEffect } from 'react';

export function useEscapeKey(onClose: () => void, enabled: boolean = true) {
   useEffect(() => {
      if (!enabled) return;
      function handleKey(e: KeyboardEvent) {
         if (e.key === 'Escape') onClose();
      }
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
   }, [enabled, onClose]);
}
