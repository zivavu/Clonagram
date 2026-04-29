function saveAssetToDatabase(data: any) {
   console.log(data);
}

export async function POST(request: Request) {
   const body = await request.json();
   const { type, data } = body;

   if (type === 'video.asset.ready') {
      saveAssetToDatabase(data);
   } else {
   }
   return Response.json({ message: 'ok' });
}
