import crypto from 'node:crypto';

function verifyMuxSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
   const parts = signatureHeader.split(',');
   const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
   const signature = parts.find(p => p.startsWith('h='))?.slice(2);
   if (!timestamp || !signature) return false;

   const signedPayload = `${timestamp}.${rawBody}`;
   const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
   return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
   const rawBody = await request.text();
   const signatureHeader = request.headers.get('mux-signature') ?? '';
   const webhookSecret = process.env.MUX_WEBHOOK_SECRET ?? '';

   if (!verifyMuxSignature(rawBody, signatureHeader, webhookSecret)) {
      return Response.json({ message: 'invalid signature' }, { status: 401 });
   }

   const { type, data } = JSON.parse(rawBody);

   if (type === 'video.asset.ready') {
      // TODO: save asset to database
   }

   return Response.json({ message: 'ok' });
}
