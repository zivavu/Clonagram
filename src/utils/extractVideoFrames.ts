export const STRIP_FRAMES = 5;
const THUMB_W = 80;
const THUMB_H = 100;

export async function extractVideoFrames(
   src: string,
): Promise<{ urls: string[]; duration: number }> {
   return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.preload = 'auto';

      const canvas = document.createElement('canvas');
      canvas.width = THUMB_W;
      canvas.height = THUMB_H;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
         reject(new Error('No 2d context'));
         return;
      }

      let index = 0;
      let duration = 0;
      const urls: string[] = [];

      const seekNext = () => {
         if (index >= STRIP_FRAMES) {
            video.src = '';
            resolve({ urls, duration });
            return;
         }
         video.currentTime = (index / (STRIP_FRAMES - 1)) * duration;
      };

      video.onloadedmetadata = () => {
         duration = video.duration;
         if (!Number.isFinite(duration) || duration <= 0) {
            reject(new Error('Invalid video duration'));
            return;
         }
         seekNext();
      };

      video.onseeked = () => {
         ctx.drawImage(video, 0, 0, THUMB_W, THUMB_H);
         canvas.toBlob(
            blob => {
               if (blob) urls.push(URL.createObjectURL(blob));
               index++;
               seekNext();
            },
            'image/jpeg',
            0.7,
         );
      };

      video.onerror = () => reject(new Error('Video load error'));
   });
}
