const MAX_DIM = 2048;

export async function compressMessageImage(file: File) {
   const bitmap = await createImageBitmap(file);
   const { width, height } = bitmap;

   const longer = Math.max(width, height);
   const scale = longer <= MAX_DIM ? 1 : MAX_DIM / longer;
   const outW = Math.round(width * scale);
   const outH = Math.round(height * scale);

   const canvas = new OffscreenCanvas(outW, outH);
   const ctx = canvas.getContext('2d');
   if (!ctx) throw new Error('2D context not available');
   ctx.drawImage(bitmap, 0, 0, outW, outH);
   bitmap.close();

   return canvas.convertToBlob({ type: 'image/webp', quality: 0.75 });
}
