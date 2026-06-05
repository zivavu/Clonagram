const MAX_DIM = 1920;

export async function compressMessageImage(file: File): Promise<Blob> {
   const bitmap = await createImageBitmap(file);
   const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
   const outW = Math.round(bitmap.width * scale);
   const outH = Math.round(bitmap.height * scale);

   const canvas = new OffscreenCanvas(outW, outH);
   const ctx = canvas.getContext('2d');
   if (!ctx) throw new Error('2D context not available');
   ctx.drawImage(bitmap, 0, 0, outW, outH);
   bitmap.close();

   return canvas.convertToBlob({ type: 'image/webp', quality: 0.85 });
}
