const BLUR_SIZE = 20;
const WEBP_QUALITY = 0.85;
const BLUR_QUALITY = 0.5;

export async function bakeStoryImage(file: File): Promise<{ blob: Blob; blurDataUrl: string }> {
   return new Promise((resolve, reject) => {
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

         const blurCanvas = document.createElement('canvas');
         blurCanvas.width = BLUR_SIZE;
         blurCanvas.height = Math.round(BLUR_SIZE * (img.naturalHeight / img.naturalWidth));
         const blurCtx = blurCanvas.getContext('2d');
         if (!blurCtx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Canvas context unavailable'));
            return;
         }
         blurCtx.drawImage(img, 0, 0, blurCanvas.width, blurCanvas.height);
         const blurDataUrl = blurCanvas.toDataURL('image/webp', BLUR_QUALITY);

         canvas.toBlob(
            blob => {
               URL.revokeObjectURL(objectUrl);
               if (!blob) {
                  reject(new Error('Failed to convert image to WebP'));
                  return;
               }
               resolve({ blob, blurDataUrl });
            },
            'image/webp',
            WEBP_QUALITY,
         );
      };

      img.onerror = () => {
         URL.revokeObjectURL(objectUrl);
         reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
   });
}
