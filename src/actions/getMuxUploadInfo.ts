'use server';
import 'server-only';

import { getMuxClient } from '../lib/mux';

export interface MuxUploadInfo {
   status: 'waiting' | 'asset_created' | 'errored' | 'cancelled' | 'timed_out';
   assetId: string | null;
   playbackId: string | null;
   duration: number | null;
   error: string | null;
}

export async function getMuxUploadInfo(uploadId: string): Promise<MuxUploadInfo> {
   const muxClient = getMuxClient();
   const upload = await muxClient.video.uploads.retrieve(uploadId);

   if (
      upload.status === 'errored' ||
      upload.status === 'cancelled' ||
      upload.status === 'timed_out'
   ) {
      return {
         status: upload.status,
         assetId: null,
         playbackId: null,
         duration: null,
         error: upload.error?.message ?? 'Upload failed',
      };
   }

   if (upload.status === 'waiting' || !upload.asset_id) {
      return {
         status: upload.status,
         assetId: null,
         playbackId: null,
         duration: null,
         error: null,
      };
   }

   const asset = await muxClient.video.assets.retrieve(upload.asset_id);
   const playbackId = asset.playback_ids?.[0]?.id ?? null;

   return {
      status: 'asset_created',
      assetId: upload.asset_id,
      playbackId,
      duration: asset.duration ?? null,
      error: null,
   };
}
