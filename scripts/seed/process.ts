import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { NICHE_COLLECTIONS } from './helpers/collections';
import { IMAGE_CONCURRENCY, IMAGES_DIR, PROFILES_JSON } from './helpers/config';
import { processImage } from './lib/imageProcessor';
import { generateAltText, generatePostContent } from './lib/openrouter';
import { getNicheVideo } from './lib/pexels';
import {
   downloadImage,
   getCollectionPhoto,
   getPortraitPhoto,
   type UnsplashPhotoResult,
} from './lib/unsplash';
import type { SeedData } from './types';

async function photoFromNiche(collectionIds: string[]): Promise<UnsplashPhotoResult> {
   const shuffled = [...collectionIds];
   for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
   }
   for (const id of shuffled) {
      try {
         return await getCollectionPhoto(id);
      } catch {
         // try next collection
      }
   }
   throw new Error(`No photos available in any collection for niche: ${collectionIds.join(', ')}`);
}

async function runBatch(tasks: (() => Promise<void>)[], concurrency: number) {
   for (let i = 0; i < tasks.length; i += concurrency) {
      const results = await Promise.allSettled(tasks.slice(i, i + concurrency).map(t => t()));
      for (const r of results) {
         if (r.status === 'rejected') {
            const reason = r.reason;
            throw reason instanceof Error
               ? reason
               : new Error(`Task failed: ${JSON.stringify(reason)}`);
         }
      }
   }
}

async function main() {
   const data: SeedData = JSON.parse(readFileSync(PROFILES_JSON, 'utf-8'));
   const tasks: (() => Promise<void>)[] = [];

   for (const profile of data.profiles) {
      const profileDir = `${IMAGES_DIR}/${profile.id}`;
      mkdirSync(profileDir, { recursive: true });

      const avatarPath = `${profileDir}/avatar.webp`;
      tasks.push(async () => {
         if (existsSync(avatarPath)) return;
         console.log(`Avatar: ${profile.username}`);
         const photo = await getPortraitPhoto();
         const buf = await downloadImage(photo.url);
         const processed = await processImage(buf, 'avatar');
         writeFileSync(avatarPath, processed.buffer);
         profile.avatar = {
            blurDataUrl: processed.blurDataUrl,
            width: processed.width,
            height: processed.height,
         };
      });

      if (profile.hasImages) {
         for (let pi = 0; pi < profile.posts.length; pi++) {
            const post = profile.posts[pi];
            for (let ii = 0; ii < post.imageCount; ii++) {
               const imagePath = `${profileDir}/post_${pi}_${ii}.webp`;
               const capturedPi = pi;
               const capturedIi = ii;
               tasks.push(async () => {
                  if (existsSync(imagePath)) return;
                  console.log(`Post image: ${profile.username} p${capturedPi} i${capturedIi}`);
                  const photo = await photoFromNiche(NICHE_COLLECTIONS[profile.niche]);
                  const buf = await downloadImage(photo.url);
                  const processed = await processImage(buf, post.aspectRatio);
                  writeFileSync(imagePath, processed.buffer);

                  let altText: string | undefined;
                  if (capturedIi === 0) {
                     const content = await generatePostContent(
                        photo.url,
                        profile.niche,
                        profile.bio,
                     );
                     post.caption = content.caption || post.caption;
                     post.contextualComments = content.contextualComments;
                     altText = content.altText || undefined;
                  } else {
                     altText = await generateAltText(photo.url);
                  }

                  post.images[capturedIi] = {
                     blurDataUrl: processed.blurDataUrl,
                     width: processed.width,
                     height: processed.height,
                     attribution: photo.attribution,
                     altText,
                  };
               });
            }
         }

         for (let si = 0; si < profile.stories.length; si++) {
            const story = profile.stories[si];
            if (!story.hasImage) continue;
            const storyPath = `${profileDir}/story_${si}.webp`;
            const capturedSi = si;
            tasks.push(async () => {
               if (existsSync(storyPath)) return;
               console.log(`Story image: ${profile.username} s${capturedSi}`);
               const photo = await photoFromNiche(NICHE_COLLECTIONS[profile.niche]);
               const buf = await downloadImage(photo.url);
               const processed = await processImage(buf, '9:16');
               writeFileSync(storyPath, processed.buffer);
               story.image = {
                  blurDataUrl: processed.blurDataUrl,
                  width: processed.width,
                  height: processed.height,
                  attribution: photo.attribution,
               };
            });
         }
      }

      for (const reel of profile.reels) {
         if (reel.pexelsVideoUrl) continue;
         const capturedReel = reel;
         tasks.push(async () => {
            console.log(`Reel video: ${profile.username} (${profile.niche})`);
            const video = await getNicheVideo(profile.niche);
            capturedReel.pexelsVideoUrl = video.url;
            capturedReel.width = video.width;
            capturedReel.height = video.height;
            capturedReel.duration = video.duration;
         });
      }
   }

   console.log(`Processing ${tasks.length} tasks (concurrency: ${IMAGE_CONCURRENCY})...`);
   await runBatch(tasks, IMAGE_CONCURRENCY);

   writeFileSync(PROFILES_JSON, JSON.stringify(data, null, 2));
   console.log(`✓ Done. Updated ${PROFILES_JSON} with image and video metadata.`);
}

main().catch(err => {
   console.error(
      'FATAL:',
      err instanceof Error ? `${err.message}\n${err.stack}` : JSON.stringify(err),
   );
   process.exit(1);
});
