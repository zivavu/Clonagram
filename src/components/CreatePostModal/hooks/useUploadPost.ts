import { useEffect } from 'react';
import { createPost } from '@/src/actions/createPost';
import { getMuxUploadInfo } from '@/src/actions/getMuxUploadInfo';
import { uploadImage } from '@/src/actions/uploadImage';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { bakeImage } from '@/src/utils/bakeImage';
import { processVideo } from '@/src/utils/processVideo';
import type { MediaResult, PostData, PostMedia } from '../types';

interface UseUploadPostParams {
   postData: PostData;
   onDone: () => void;
}

const MUX_POLL_MAX_ATTEMPTS = 30;
const MUX_POLL_INTERVAL_MS = 2000;

async function pollMuxAsset(
   uploadId: string,
): Promise<{ assetId: string; playbackId: string; duration: number }> {
   for (let attempt = 0; attempt < MUX_POLL_MAX_ATTEMPTS; attempt++) {
      const info = await getMuxUploadInfo(uploadId);

      if (
         info.status === 'asset_created' &&
         info.assetId &&
         info.playbackId &&
         info.duration !== null
      ) {
         return { assetId: info.assetId, playbackId: info.playbackId, duration: info.duration };
      }

      if (info.error) {
         throw new Error(info.error);
      }

      await new Promise(r => setTimeout(r, MUX_POLL_INTERVAL_MS));
   }

   throw new Error('Mux asset creation timed out');
}

async function processMedia(media: PostMedia, postData: PostData): Promise<MediaResult> {
   if (media.type === 'image') {
      const blob = await bakeImage(media, postData.aspectRatio);
      const fileName = `${crypto.randomUUID()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const data = await uploadImage({ file, bucket: 'posts', fileName });
      return { type: 'image', path: data.publicUrl };
   }

   const processedFile = await processVideo(
      media.file,
      media.trimStart,
      media.trimEnd,
      media.duration,
      media.muted,
      postData.aspectRatio,
   );

   const { uploadUrl, uploadId } = await uploadVideo();
   const res = await fetch(uploadUrl, {
      method: 'PUT',
      body: processedFile,
      headers: { 'Content-Type': processedFile.type },
   });
   if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);

   const { assetId, playbackId, duration } = await pollMuxAsset(uploadId);
   return { type: 'video', assetId, playbackId, duration };
}

export function useUploadPost({ postData, onDone }: UseUploadPostParams): void {
   // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
   useEffect(() => {
      async function run() {
         const mediaResults = await Promise.all(
            postData.media.map(media => processMedia(media, postData)),
         );
         const { media: _, ...postMeta } = postData;
         await createPost({ ...postMeta, mediaResults });
         onDone();
      }

      run().catch(() => {});
   }, []);
}
