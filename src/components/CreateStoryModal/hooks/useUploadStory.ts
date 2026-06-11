import { useEffect, useRef, useState } from 'react';
import { createStory } from '@/src/actions/story/createStory';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { supabase } from '@/src/lib/supabase/client';
import { bakeStoryImage } from '@/src/utils/bakeStoryImage';
import { pollMuxAsset } from '@/src/utils/pollMuxAsset';
import type { StoryMedia, StoryMediaResult } from '../types';

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

interface UseUploadStoryParams {
   media: StoryMedia;
   onDone: () => void;
}

async function processStoryMedia(media: StoryMedia): Promise<StoryMediaResult> {
   if (media.type === 'image') {
      const { blob, blurDataUrl } = await bakeStoryImage(media.file);
      const fileName = `${crypto.randomUUID()}.webp`;
      const file = new File([blob], fileName, { type: 'image/webp' });
      const { error: uploadError } = await supabase.storage.from('stories').upload(fileName, file);
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
      const { data: urlData } = supabase.storage.from('stories').getPublicUrl(fileName);
      return { type: 'image', url: urlData.publicUrl, blurDataUrl };
   }

   const { uploadUrl, uploadId } = await uploadVideo();
   const res = await fetch(uploadUrl, {
      method: 'PUT',
      body: media.file,
      headers: { 'Content-Type': media.file.type },
   });
   if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);
   const { assetId, playbackId, duration } = await pollMuxAsset(uploadId);
   return { type: 'video', assetId, playbackId, duration };
}

export function useUploadStory({ media, onDone }: UseUploadStoryParams) {
   const [status, setStatus] = useState<UploadStatus>('idle');
   const [error, setError] = useState<string | null>(null);
   const mediaRef = useRef(media);
   const onDoneRef = useRef(onDone);
   const hasRun = useRef(false);

   mediaRef.current = media;
   onDoneRef.current = onDone;

   useEffect(() => {
      if (hasRun.current) return;
      hasRun.current = true;

      async function run() {
         setStatus('uploading');
         const mediaResult = await processStoryMedia(mediaRef.current);
         await createStory({ mediaResult });
         setStatus('done');
         onDoneRef.current();
      }

      run().catch(err => {
         setError(err instanceof Error ? err.message : 'Upload failed');
         setStatus('error');
      });
   }, []);

   return { status, error };
}
