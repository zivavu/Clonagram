const UNSPLASH_API = 'https://api.unsplash.com';

interface UnsplashPhoto {
   id: string;
   links: { html: string; download_location: string };
   urls: { full: string; regular: string };
   user: { name: string; links: { html: string } };
}

export interface UnsplashAttribution {
   photographerName: string;
   photographerUrl: string;
   photoUrl: string;
}

export interface UnsplashPhotoResult {
   url: string;
   attribution: UnsplashAttribution;
   downloadLocation: string;
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

function toResult(photo: UnsplashPhoto): UnsplashPhotoResult {
   return {
      url: photo.urls.regular,
      downloadLocation: photo.links.download_location,
      attribution: {
         photographerName: photo.user.name,
         photographerUrl: photo.user.links.html,
         photoUrl: photo.links.html,
      },
   };
}

export async function triggerDownload(downloadLocation: string): Promise<void> {
   const key = process.env.UNSPLASH_ACCESS_KEY;
   if (!key) return;
   try {
      await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } });
   } catch {
      // non-fatal
   }
}

export async function getCollectionPhoto(collectionId: string): Promise<UnsplashPhotoResult> {
   if (!collectionCache.has(collectionId)) {
      const photos = await unsplashGet<UnsplashPhoto[]>(
         `/collections/${collectionId}/photos?per_page=30`,
      );
      collectionCache.set(collectionId, photos);
   }

   const photos = collectionCache.get(collectionId);
   if (!photos?.length) throw new Error(`Collection ${collectionId} returned 0 photos`);
   return toResult(photos[Math.floor(Math.random() * photos.length)]);
}

const portraitPool: UnsplashPhotoResult[] = [];
let portraitRefill: Promise<void> | null = null;

async function refillPortraitPool() {
   const photos = await unsplashGet<UnsplashPhoto[]>(
      '/photos/random?count=30&query=portrait+person+lifestyle+colorful&orientation=squarish',
   );
   for (const p of photos) {
      if (p.urls.regular) portraitPool.push(toResult(p));
   }
}

export async function getPortraitPhoto(): Promise<UnsplashPhotoResult> {
   if (!portraitPool.length) {
      if (!portraitRefill)
         portraitRefill = refillPortraitPool().finally(() => {
            portraitRefill = null;
         });
      await portraitRefill;
   }
   if (!portraitPool.length) throw new Error('Portrait pool is empty after refill');
   return portraitPool.splice(Math.floor(Math.random() * portraitPool.length), 1)[0];
}

export async function downloadImage(url: string): Promise<Buffer> {
   const res = await fetch(url);
   if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
   return Buffer.from(await res.arrayBuffer());
}
