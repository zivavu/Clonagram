import type { AspectRatio } from '../components/CreatePostModal/types';

type FFmpegType = InstanceType<typeof import('@ffmpeg/ffmpeg').FFmpeg>;

let ffmpegInstance: FFmpegType | null = null;

async function getFFmpeg() {
   if (ffmpegInstance) return ffmpegInstance;
   const { FFmpeg } = await import('@ffmpeg/ffmpeg');
   ffmpegInstance = new FFmpeg();
   await ffmpegInstance.load();
   return ffmpegInstance;
}

function getFileExtension(name: string) {
   const dotIndex = name.lastIndexOf('.');
   return dotIndex > 0 ? name.slice(dotIndex) : '.mp4';
}

function getVideoDimensions(file: File) {
   return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
         URL.revokeObjectURL(url);
         resolve({ width: video.videoWidth, height: video.videoHeight });
      };
      video.onerror = () => {
         URL.revokeObjectURL(url);
         reject(new Error('Failed to read video dimensions'));
      };
      video.src = url;
   });
}

async function isCropNeeded(
   file: File,
   aspectRatio: AspectRatio,
   zoom: number,
   panX: number,
   panY: number,
) {
   if (zoom !== 1 || panX !== 0 || panY !== 0) return true;
   if (aspectRatio === 'original') return false;

   const { width, height } = await getVideoDimensions(file);
   const [tw, th] = aspectRatio.split(':').map(Number);
   const baseCropW = Math.min(width, (height * tw) / th);
   const baseCropH = Math.min(height, (width * th) / tw);
   return Math.abs(baseCropW - width) >= 1 || Math.abs(baseCropH - height) >= 1;
}

const OUTPUT_SCALE: Record<Exclude<AspectRatio, 'original'>, string> = {
   '1:1': '1080:1080',
   '4:5': '1080:1350',
   '16:9': '1920:1080',
   '9:16': '1080:1920',
};

function buildCropFilter(
   aspectRatio: AspectRatio,
   zoom: number,
   panX: number,
   panY: number,
   imageDisplayW: number,
   imageDisplayH: number,
) {
   let baseCropWExpr: string;
   let baseCropHExpr: string;
   let outScale: string;

   if (aspectRatio === 'original') {
      baseCropWExpr = 'iw';
      baseCropHExpr = 'ih';
      outScale = 'iw:ih';
   } else {
      const [tw, th] = aspectRatio.split(':').map(Number);
      baseCropWExpr = `min(iw\\,ih*${tw}/${th})`;
      baseCropHExpr = `min(ih\\,iw*${th}/${tw})`;
      outScale = OUTPUT_SCALE[aspectRatio];
   }

   const panXFactor = imageDisplayW > 0 ? panX / (imageDisplayW * zoom) : 0;
   const panYFactor = imageDisplayH > 0 ? panY / (imageDisplayH * zoom) : 0;

   const cropWExpr = `${baseCropWExpr}/${zoom}`;
   const cropHExpr = `${baseCropHExpr}/${zoom}`;
   const panXExpr = panXFactor !== 0 ? `${panXFactor}*iw` : '0';
   const panYExpr = panYFactor !== 0 ? `${panYFactor}*ih` : '0';
   const cropXExpr = `iw/2-${baseCropWExpr}/(2*${zoom})-${panXExpr}`;
   const cropYExpr = `ih/2-${baseCropHExpr}/(2*${zoom})-${panYExpr}`;

   return `crop=${cropWExpr}:${cropHExpr}:${cropXExpr}:${cropYExpr},scale=${outScale}:flags=lanczos`;
}

export async function processVideo(
   file: File,
   trimStart: number,
   trimEnd: number,
   duration: number,
   muted: boolean,
   aspectRatio: AspectRatio,
   zoom: number,
   panX: number,
   panY: number,
   imageDisplayW: number,
   imageDisplayH: number,
) {
   const needsCrop = await isCropNeeded(file, aspectRatio, zoom, panX, panY);
   const needsProcessing =
      trimStart > 0 || (trimEnd > 0 && trimEnd < duration) || muted || needsCrop;

   if (!needsProcessing) {
      return file;
   }

   const ffmpeg = await getFFmpeg();
   const { fetchFile } = await import('@ffmpeg/util');
   const suffix = crypto.randomUUID().slice(0, 8);
   const ext = getFileExtension(file.name);
   const inputName = `input_${suffix}${ext}`;
   const outputName = `output_${suffix}.mp4`;

   await ffmpeg.writeFile(inputName, await fetchFile(file));

   const args: string[] = [];

   if (trimStart > 0) {
      args.push('-ss', String(trimStart));
   }

   args.push('-i', inputName);

   if (trimEnd > 0 && trimEnd < duration) {
      args.push('-to', String(trimEnd - trimStart));
   }

   if (needsCrop) {
      args.push(
         '-vf',
         buildCropFilter(aspectRatio, zoom, panX, panY, imageDisplayW, imageDisplayH),
      );
      args.push('-map', '0:v:0');
      if (muted) {
         args.push('-an');
      } else {
         args.push('-map', '0:a?', '-c:a', 'aac');
      }
      args.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p');
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
