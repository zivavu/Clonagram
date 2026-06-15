const UNSPLASH_API = 'https://api.unsplash.com';

interface UnsplashPhoto {
   urls: { full: string; regular: string };
}

async function unsplashGet<T>(path: string): Promise<T> {
   const key = process.env.UNSPLASH_ACCESS_KEY;
   if (!key) throw new Error('Missing UNSPLASH_ACCESS_KEY');

   for (let attempt = 1; ; attempt++) {
      const res = await fetch(`${UNSPLASH_API}${path}`, {
         headers: { Authorization: `Client-ID ${key}` },
      });

      if (res.status === 403 || res.status === 429) {
         if (attempt >= 10) throw new Error(`Unsplash rate limited after ${attempt} retries`);
         const waitSec = 65;
         console.log(`Unsplash rate limit hit — waiting ${waitSec}s (attempt ${attempt})...`);
         await new Promise(r => setTimeout(r, waitSec * 1000));
         continue;
      }

      if (!res.ok) throw new Error(`Unsplash (${res.status}): ${await res.text()}`);
      return res.json() as Promise<T>;
   }
}

const collectionCache = new Map<string, UnsplashPhoto[]>();

export async function getCollectionPhoto(collectionId: string): Promise<string> {
   if (!collectionCache.has(collectionId)) {
      const photos = await unsplashGet<UnsplashPhoto[]>(
         `/collections/${collectionId}/photos?per_page=30`,
      );
      collectionCache.set(collectionId, photos);
   }

   const photos = collectionCache.get(collectionId);
   if (!photos?.length) throw new Error(`Collection ${collectionId} returned 0 photos`);
   const photo = photos[Math.floor(Math.random() * photos.length)];
   return photo.urls.regular;
}

const portraitPool: string[] = [];
let portraitRefill: Promise<void> | null = null;

async function refillPortraitPool() {
   const photos = await unsplashGet<UnsplashPhoto[]>(
      '/photos/random?count=30&query=portrait+person+face&orientation=squarish',
   );
   for (const p of photos) portraitPool.push(p.urls.regular);
}

export async function getPortraitPhotoUrl(): Promise<string> {
   if (!portraitPool.length) {
      if (!portraitRefill)
         portraitRefill = refillPortraitPool().finally(() => {
            portraitRefill = null;
         });
      await portraitRefill;
   }
   return portraitPool.splice(Math.floor(Math.random() * portraitPool.length), 1)[0];
}

export async function downloadImage(url: string): Promise<Buffer> {
   const res = await fetch(url);
   if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
   return Buffer.from(await res.arrayBuffer());
}
