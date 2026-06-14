const UNSPLASH_API = 'https://api.unsplash.com';

interface UnsplashPhoto {
   urls: { full: string; regular: string };
}

async function unsplashGet<T>(path: string): Promise<T> {
   const key = process.env.UNSPLASH_ACCESS_KEY;
   if (!key) throw new Error('Missing UNSPLASH_ACCESS_KEY');

   const res = await fetch(`${UNSPLASH_API}${path}`, {
      headers: { Authorization: `Client-ID ${key}` },
   });

   if (!res.ok) throw new Error(`Unsplash (${res.status}): ${await res.text()}`);
   return res.json() as Promise<T>;
}

const collectionCache = new Map<string, UnsplashPhoto[]>();

export async function getCollectionPhoto(collectionId: string): Promise<string> {
   if (!collectionCache.has(collectionId)) {
      const photos = await unsplashGet<UnsplashPhoto[]>(
         `/collections/${collectionId}/photos?per_page=30`,
      );
      collectionCache.set(collectionId, photos);
   }

   const photos = collectionCache.get(collectionId)!;
   const photo = photos[Math.floor(Math.random() * photos.length)];
   return photo.urls.full;
}

export async function getPortraitPhotoUrl(): Promise<string> {
   const photo = await unsplashGet<UnsplashPhoto>(
      '/photos/random?query=portrait+person+face&orientation=squarish',
   );
   return photo.urls.regular;
}

export async function downloadImage(url: string): Promise<Buffer> {
   const res = await fetch(url);
   if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
   return Buffer.from(await res.arrayBuffer());
}
