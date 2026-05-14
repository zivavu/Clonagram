'use server';
import 'server-only';

import { getMuxClient } from '../lib/mux';

export async function uploadVideo() {
   const muxClient = getMuxClient();
   const upload = await muxClient.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_HOSTNAME ?? 'https://localhost:3000',
      new_asset_settings: {
         playback_policy: ['public'],
         video_quality: 'basic',
      },
   });

   if (!upload.url) throw new Error('Upload failed');
   return { uploadUrl: upload.url, uploadId: upload.id };
}
