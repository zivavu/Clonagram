import { getMuxUploadInfo } from '@/src/actions/getMuxUploadInfo';

const MUX_POLL_MAX_ATTEMPTS = 30;
const MUX_POLL_INTERVAL_MS = 5000;

export async function pollMuxAsset(
   uploadId: string,
): Promise<{ assetId: string; playbackId: string; duration: number }> {
   for (let attempt = 0; attempt < MUX_POLL_MAX_ATTEMPTS; attempt++) {
      const info = await getMuxUploadInfo({ uploadId });

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

   throw new Error('Asset creation timed out');
}
