import { useEffect } from 'react';
import { uuidv4 } from 'zod';
import { createPost } from '@/src/actions/createPost';
import { uploadImage } from '@/src/actions/uploadImage';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { bakeImage } from '@/src/utils/bakeImage';
import { processVideo } from '@/src/utils/processVideo';
import type { MediaResult, PostData, PostMedia } from '../types';

interface UseUploadPostParams {
   postData: PostData;
   onDone: () => void;
}

async function processMedia(media: PostMedia, postData: PostData): Promise<MediaResult> {
   if (media.type === 'image') {
      const blob = await bakeImage(media, postData.aspectRatio);
      const fileName = `${uuidv4()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const data = await uploadImage({ file, bucket: 'posts', fileName });
      return { type: 'image', path: data.path };
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
   return { type: 'video', uploadId };
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
