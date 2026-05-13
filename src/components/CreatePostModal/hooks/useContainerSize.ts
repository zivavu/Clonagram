import { type RefObject, useEffect, useState } from 'react';

export function useContainerSize(ref: RefObject<HTMLElement | null>): { w: number; h: number } {
   const [size, setSize] = useState({ w: 0, h: 0 });

   useEffect(() => {
      const el = ref.current;
      if (!el) return;
      setSize({ w: el.clientWidth, h: el.clientHeight });
      const observer = new ResizeObserver(entries => {
         for (const entry of entries) {
            const { width, height } = entry.contentRect;
            setSize({ w: width, h: height });
         }
      });
      observer.observe(el);
      return () => observer.disconnect();
   }, [ref]);

   return size;
}
