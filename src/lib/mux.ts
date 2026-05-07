import Mux from '@mux/mux-node';

let _muxClient: Mux | null = null;

export function getMuxClient(): Mux {
   if (_muxClient) return _muxClient;

   const muxTokenId = process.env.MUX_TOKEN_ID;
   const muxTokenSecret = process.env.MUX_TOKEN_SECRET;
   if (!muxTokenId || !muxTokenSecret) {
      throw new Error('Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET');
   }

   _muxClient = new Mux({ tokenId: muxTokenId, tokenSecret: muxTokenSecret });
   return _muxClient;
}
