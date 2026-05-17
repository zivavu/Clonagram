import { useEffect, useRef, useState } from 'react';
import { getMuxUploadInfo } from '@/src/actions/getMuxUploadInfo';
import { createPost } from '@/src/actions/post/createPost';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { bakeImage } from '@/src/utils/bakeImage';
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
      const supabase = createBrowserClient();
      const { error: uploadError } = await supabase.storage.from('posts').upload(fileName, file);
      if (uploadError) {
         throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName);
      return { type: 'image', path: urlData.publicUrl };
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
