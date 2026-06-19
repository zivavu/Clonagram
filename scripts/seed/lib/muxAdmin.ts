import Mux from '@mux/mux-node';

export interface MuxAsset {
   assetId: string;
   playbackId: string;
   duration: number;
}

function getMuxClient() {
   const tokenId = process.env.MUX_TOKEN_ID;
   const tokenSecret = process.env.MUX_TOKEN_SECRET;
   if (!tokenId || !tokenSecret) throw new Error('Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET');
   return new Mux({ tokenId, tokenSecret });
}

export async function createMuxAssetFromUrl(videoUrl: string): Promise<MuxAsset> {
   const mux = getMuxClient();

   const asset = await mux.video.assets.create({
      input: [{ url: videoUrl }],
      playback_policy: ['public'],
      video_quality: 'plus',
   });

   for (let attempt = 0; attempt < 60; attempt++) {
      await new Promise(r => setTimeout(r, 5000));
      const updated = await mux.video.assets.retrieve(asset.id);

      if (updated.status === 'ready') {
         const playbackId = updated.playback_ids?.[0]?.id;
         if (!playbackId) throw new Error('Mux asset ready but has no playback ID');
         return {
            assetId: asset.id,
            playbackId,
            duration: updated.duration ?? 0,
         };
      }

      if (updated.status === 'errored') {
         throw new Error(`Mux encoding failed for asset ${asset.id}`);
      }
   }

   throw new Error(`Mux asset ${asset.id} timed out after 5 minutes`);
}
