const BLUR_SIZE = 20;

export async function canvasToBlurDataUrl(canvas: HTMLCanvasElement | OffscreenCanvas) {
   const blurW = BLUR_SIZE;
   const blurH = Math.round(BLUR_SIZE * (canvas.height / canvas.width));
   const source = await createImageBitmap(canvas);
   const blurCanvas = document.createElement('canvas');
   blurCanvas.width = blurW;
   blurCanvas.height = blurH;
   const blurCtx = blurCanvas.getContext('2d');
   if (!blurCtx) return '';
   blurCtx.drawImage(source, 0, 0, blurW, blurH);
   source.close();
   return blurCanvas.toDataURL('image/webp', 0.5);
}

export function canvasToWebpBlob(canvas: HTMLCanvasElement | OffscreenCanvas, quality = 0.85) {
   if (canvas instanceof OffscreenCanvas) {
      return canvas.convertToBlob({ type: 'image/webp', quality });
   }
   return new Promise<Blob | null>((resolve, reject) => {
      canvas.toBlob(
         blob => (blob ? resolve(blob) : reject(new Error('Blob creation failed'))),
         'image/webp',
         quality,
      );
   });
}
