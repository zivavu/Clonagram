import Mux from '@mux/mux-node';

const muxTokenId = process.env.MUX_TOKEN_ID;
const muxTokenSecret = process.env.MUX_TOKEN_SECRET;
if (!muxTokenId || !muxTokenSecret) {
   throw new Error('Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET');
}

export const muxClient = new Mux({
   tokenId: muxTokenId,
   tokenSecret: muxTokenSecret,
});
