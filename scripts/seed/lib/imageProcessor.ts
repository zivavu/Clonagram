import sharp from 'sharp';
import { BLUR_WIDTH, WEBP_QUALITY } from '../config';
import type { SeedAspectRatio } from '../types';

const OUTPUT_SIZES: Record<SeedAspectRatio, { w: number; h: number }> = {
   '1:1': { w: 1080, h: 1080 },
   '4:5': { w: 1080, h: 1350 },
   '16:9': { w: 1920, h: 1080 },
   '9:16': { w: 1080, h: 1920 },
};

export interface ProcessedImage {
   buffer: Buffer;
   blurDataUrl: string;
   width: number;
   height: number;
}

export async function processImage(
   sourceBuffer: Buffer,
   aspectRatio: SeedAspectRatio | 'avatar',
): Promise<ProcessedImage> {
   const { w: outW, h: outH } =
      aspectRatio === 'avatar' ? { w: 400, h: 400 } : OUTPUT_SIZES[aspectRatio];

   const meta = await sharp(sourceBuffer).metadata();
   const srcW = meta.width ?? 1;
   const srcH = meta.height ?? 1;

   const imgRatio = srcW / srcH;
   const cropRatio = outW / outH;

   const cropW =
      imgRatio >= cropRatio ? Math.round(srcH * cropRatio) : srcW;
   const cropH =
      imgRatio >= cropRatio ? srcH : Math.round(srcW / cropRatio);

   const left = Math.round((srcW - cropW) / 2);
   const top = Math.round((srcH - cropH) / 2);

   const [buffer, blurBuffer] = await Promise.all([
      sharp(sourceBuffer)
         .extract({ left, top, width: cropW, height: cropH })
         .resize(outW, outH)
         .webp({ quality: WEBP_QUALITY })
         .toBuffer(),
      sharp(sourceBuffer)
         .extract({ left, top, width: cropW, height: cropH })
         .resize(BLUR_WIDTH)
         .jpeg({ quality: 40 })
         .toBuffer(),
   ]);

   const blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;
   return { buffer, blurDataUrl, width: outW, height: outH };
}
