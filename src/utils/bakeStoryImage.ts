import { canvasToBlurDataUrl, canvasToWebpBlob } from './canvasBlur';

export async function bakeStoryImage(file: File) {
   return new Promise<{ blob: Blob; blurDataUrl: string }>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
         const canvas = document.createElement('canvas');
         canvas.width = img.naturalWidth;
         canvas.height = img.naturalHeight;
         const ctx = canvas.getContext('2d');
         if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Canvas context unavailable'));
            return;
         }
         ctx.drawImage(img, 0, 0);
         URL.revokeObjectURL(objectUrl);

         Promise.all([canvasToBlurDataUrl(canvas), canvasToWebpBlob(canvas)]).then(
            ([blurDataUrl, blob]) => {
               if (!blob) {
                  reject(new Error('Failed to create blob'));
                  return;
               }
               resolve({ blob, blurDataUrl });
            },
            reject,
         );
      };

      img.onerror = () => {
         URL.revokeObjectURL(objectUrl);
         reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
   });
}
