export function captureVideoFrame(src: string, time: number): Promise<string> {
   return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.playsInline = true;
      video.preload = 'auto';
      video.onloadedmetadata = () => {
         video.currentTime = Math.min(time, video.duration || time);
      };
      video.onseeked = () => {
         const canvas = document.createElement('canvas');
         canvas.width = video.videoWidth || 640;
         canvas.height = video.videoHeight || 360;
         const ctx = canvas.getContext('2d');
         if (!ctx) {
            reject(new Error('No 2d context'));
            return;
         }
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
         canvas.toBlob(
            blob => {
               if (blob) resolve(URL.createObjectURL(blob));
               else reject(new Error('Blob creation failed'));
            },
            'image/jpeg',
            0.85,
         );
      };
      video.onerror = () => reject(new Error('Video load error'));
      video.load();
   });
}
