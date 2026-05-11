import { useEffect, useState } from 'react';

export function useImageNaturalSize(src: string): { w: number; h: number } {
   const [size, setSize] = useState({ w: 0, h: 0 });

   useEffect(() => {
      setSize({ w: 0, h: 0 });
      const img = new Image();
      img.onload = () => setSize({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = src;
   }, [src]);

   return size;
}
