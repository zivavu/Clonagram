import { useEffect } from 'react';
import { createPost } from '@/src/actions/createPost';
import { uploadImage } from '@/src/actions/uploadImage';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { bakeImage } from '@/src/utils/bakeImage';
import type { MediaResult, PostData, PostMedia } from '../types';

interface UseUploadPostParams {
   postData: PostData;
   onDone: () => void;
}

async function processMedia(media: PostMedia, postData: PostData): Promise<MediaResult> {
   if (media.type === 'image') {
      const blob = await bakeImage(media, postData.aspectRatio);
      const fileName = `${crypto.randomUUID()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const data = await uploadImage({ file, bucket: 'posts', fileName });
      return { type: 'image', path: data.path };
   }

   const { uploadUrl, uploadId } = await uploadVideo({
      trimStart: media.trimStart,
      trimEnd: media.trimEnd,
      muted: media.muted,
      aspectRatio: postData.aspectRatio,
   });
   await fetch(uploadUrl, {
      method: 'PUT',
      body: media.file,
      headers: { 'Content-Type': media.file.type },
   });
   return { type: 'video', uploadId };
}

export function useUploadPost({ postData, onDone }: UseUploadPostParams): void {
   // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
   useEffect(() => {
      async function run() {
         const mediaResults = await Promise.all(
            postData.media.map(media => processMedia(media, postData)),
         );
         await createPost({ ...postData, mediaResults });
         onDone();
      }

      run().catch(() => {});
   }, []);
}
