import { useEffect, useState } from 'react';

export function useMediaNaturalSize(
   src: string,
   type: 'image' | 'video',
): { w: number; h: number } {
   const [size, setSize] = useState({ w: 0, h: 0 });

   useEffect(() => {
      setSize({ w: 0, h: 0 });
      if (type === 'video') {
         const video = document.createElement('video');
         video.onloadedmetadata = () => {
            setSize({ w: video.videoWidth, h: video.videoHeight });
         };
         video.onerror = () => {
            setSize({ w: 0, h: 0 });
         };
         video.src = src;
      } else {
         const img = new Image();
         img.onload = () => setSize({ w: img.naturalWidth, h: img.naturalHeight });
         img.onerror = () => setSize({ w: 0, h: 0 });
         img.src = src;
      }
   }, [src, type]);

   return size;
}
