import { useEffect, useRef, useState } from 'react';
import { createPost } from '@/src/actions/post/createPost';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { supabase } from '@/src/lib/supabase/client';
import { bakeImage } from '@/src/utils/bakeImage';
import { pollMuxAsset } from '@/src/utils/pollMuxAsset';
import { processVideo } from '@/src/utils/processVideo';
import type { MediaResult, PostData, PostMedia } from '../types';

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export interface UseUploadPostResult {
   status: UploadStatus;
   error: string | null;
}

interface UseUploadPostParams {
   postData: PostData;
   onDone: () => void;
}

function getVideoNaturalDimensions(src: string): Promise<{ width: number; height: number }> {
   return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () =>
         resolve({ width: video.videoWidth, height: video.videoHeight });
      video.onerror = reject;
      video.src = src;
   });
}

async function processMedia(media: PostMedia, postData: PostData): Promise<MediaResult> {
   if (media.type === 'image') {
      const { blob, blurDataURL, width, height } = await bakeImage(media, postData.aspectRatio);
      const fileName = `${crypto.randomUUID()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const { error: uploadError } = await supabase.storage.from('posts').upload(fileName, file);
      if (uploadError) {
         throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName);
      return {
         type: 'image',
         path: urlData.publicUrl,
         width,
         height,
         blurDataURL,
         alt: media.alt || undefined,
         tags: media.tags,
      };
   }

   const [processedFile, { width, height }] = await Promise.all([
      processVideo(
         media.file,
         media.trimStart,
         media.trimEnd,
         media.duration,
         media.muted,
         postData.aspectRatio,
         media.zoom,
         media.panX,
         media.panY,
         media.imageDisplayW,
         media.imageDisplayH,
      ),
      getVideoNaturalDimensions(media.preview),
   ]);

   const { uploadUrl, uploadId } = await uploadVideo();
   const res = await fetch(uploadUrl, {
      method: 'PUT',
      body: processedFile,
      headers: { 'Content-Type': processedFile.type },
   });
   if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);

   const { assetId, playbackId, duration } = await pollMuxAsset(uploadId);
   return { type: 'video', assetId, playbackId, duration, width, height };
}

export function useUploadPost({ postData, onDone }: UseUploadPostParams): UseUploadPostResult {
   const [status, setStatus] = useState<UploadStatus>('idle');
   const [error, setError] = useState<string | null>(null);
   const postDataRef = useRef(postData);
   const onDoneRef = useRef(onDone);
   const hasRun = useRef(false);

   postDataRef.current = postData;
   onDoneRef.current = onDone;

   useEffect(() => {
      if (hasRun.current) return;
      hasRun.current = true;

      async function run() {
         setStatus('uploading');
         const data = postDataRef.current;
         const mediaResults = await Promise.all(data.media.map(media => processMedia(media, data)));
         const { media: _, ...postMeta } = data;
         await createPost({ ...postMeta, mediaResults });
         setStatus('done');
         onDoneRef.current();
      }

      run().catch(err => {
         const message = err instanceof Error ? err.message : 'Upload failed';
         setError(message);
         setStatus('error');
      });
   }, []);

   return { status, error };
}
