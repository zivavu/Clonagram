import type { AspectRatio } from '../components/CreatePostModal/types';

type FFmpegType = InstanceType<typeof import('@ffmpeg/ffmpeg').FFmpeg>;

let ffmpegInstance: FFmpegType | null = null;

async function getFFmpeg(): Promise<FFmpegType> {
   if (ffmpegInstance) return ffmpegInstance;
   const { FFmpeg } = await import('@ffmpeg/ffmpeg');
   ffmpegInstance = new FFmpeg();
   await ffmpegInstance.load();
   return ffmpegInstance;
}

function getFileExtension(name: string): string {
   const dotIndex = name.lastIndexOf('.');
   return dotIndex > 0 ? name.slice(dotIndex) : '.mp4';
}

const ASPECT_RATIO_FILTERS: Record<Exclude<AspectRatio, 'original'>, string> = {
   '1:1': 'crop=min(iw\\,ih):min(iw\\,ih):(iw-min(iw\\,ih))/2:(ih-min(iw\\,ih))/2,scale=1080:1080:flags=lanczos',
   '4:5': 'crop=min(iw\\,ih*4/5):min(iw*5/4\\,ih):(iw-min(iw\\,ih*4/5))/2:(ih-min(iw*5/4\\,ih))/2,scale=1080:1350:flags=lanczos',
   '16:9':
      'crop=min(iw\\,ih*16/9):min(iw*9/16\\,ih):(iw-min(iw\\,ih*16/9))/2:(ih-min(iw*9/16\\,ih))/2,scale=1920:1080:flags=lanczos',
   '9:16':
      'crop=min(iw\\,ih*9/16):min(iw*16/9\\,ih):(iw-min(iw\\,ih*9/16))/2:(ih-min(iw*16/9\\,ih))/2,scale=1080:1920:flags=lanczos',
};

export async function processVideo(
   file: File,
   trimStart: number,
   trimEnd: number,
   duration: number,
   muted: boolean,
   aspectRatio: AspectRatio,
): Promise<File> {
   const needsProcessing =
      trimStart > 0 || (trimEnd > 0 && trimEnd < duration) || muted || aspectRatio !== 'original';

   if (!needsProcessing && file.type === 'video/mp4') {
      return file;
   }

   const ffmpeg = await getFFmpeg();
   const { fetchFile } = await import('@ffmpeg/util');
   const suffix = crypto.randomUUID().slice(0, 8);
   const ext = getFileExtension(file.name);
   const inputName = `input_${suffix}${ext}`;
   const outputName = `output_${suffix}.mp4`;

   await ffmpeg.writeFile(inputName, await fetchFile(file));

   const needsReencode = aspectRatio !== 'original';

   const args: string[] = [];

   if (trimStart > 0) {
      args.push('-ss', String(trimStart));
   }

   args.push('-i', inputName);

   if (trimEnd > 0 && trimEnd < duration) {
      args.push('-to', String(trimEnd - trimStart));
   }

   if (needsReencode) {
      args.push('-vf', ASPECT_RATIO_FILTERS[aspectRatio]);
      args.push('-map', '0:v:0');
      if (muted) {
         args.push('-an');
      } else {
         args.push('-map', '0:a?', '-c:a', 'aac');
      }
      args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p');
   } else {
      args.push('-map', '0:v:0', '-c:v', 'copy');
      if (muted) {
         args.push('-an');
      } else {
         args.push('-map', '0:a?', '-c:a', 'copy');
      }
   }

   args.push('-movflags', '+faststart', outputName);

   const exitCode = await ffmpeg.exec(args);
   if (exitCode !== 0) {
      throw new Error(`FFmpeg processing failed with exit code ${exitCode}`);
   }

   const raw = await ffmpeg.readFile(outputName);
   const data = new Uint8Array(raw as Uint8Array);
   const blob = new Blob([data], { type: 'video/mp4' });

   await ffmpeg.deleteFile(inputName);
   await ffmpeg.deleteFile(outputName);

   return new File([blob], 'processed.mp4', { type: 'video/mp4', lastModified: Date.now() });
}
