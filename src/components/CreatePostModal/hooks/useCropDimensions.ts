import { type AspectRatio, RATIO_NUMERIC } from '../types';

interface Size {
   w: number;
   h: number;
}

interface CropBox {
   width: number;
   height: number;
}

interface CropDimensions {
   cropBox: CropBox | null;
   imageDisplaySize: Size | null;
}

export function useCropDimensions(
   container: Size,
   natural: Size,
   aspectRatio: AspectRatio,
): CropDimensions {
   if (container.w === 0) return { cropBox: null, imageDisplaySize: null };

   const ratio = RATIO_NUMERIC[aspectRatio];
   let cropBox: CropBox;
   if (!ratio) {
      cropBox = { width: container.w, height: container.h };
   } else if (ratio >= 1) {
      const w = Math.min(container.w, container.h * ratio);
      cropBox = { width: Math.round(w), height: Math.round(w / ratio) };
   } else {
      const h = Math.min(container.h, container.w / ratio);
      cropBox = { width: Math.round(h * ratio), height: Math.round(h) };
   }

   if (natural.w === 0 || natural.h === 0) return { cropBox, imageDisplaySize: null };

   const imgRatio = natural.w / natural.h;
   const cropRatio = cropBox.width / cropBox.height;
   const imageDisplaySize =
      imgRatio >= cropRatio
         ? { w: cropBox.height * imgRatio, h: cropBox.height }
         : { w: cropBox.width, h: cropBox.width / imgRatio };

   return { cropBox, imageDisplaySize };
}
