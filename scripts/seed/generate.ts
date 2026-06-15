import { randomUUID } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { NICHE_COLLECTIONS } from './collections';
import {
   AI_BATCH_SIZE,
   HIGHLIGHTS_PER_PROFILE,
   IMAGE_PROFILE_RATIO,
   IMAGES_PER_POST,
   OUTPUT_DIR,
   POSTS_PER_PROFILE,
   PRIVATE_PROBABILITY,
   PROFILE_COUNT,
   PROFILES_JSON,
   SAME_NICHE_WEIGHT,
   STORIES_PER_PROFILE,
   VERIFIED_PROBABILITY,
   WEBSITE_PROBABILITY,
} from './config';
import { generateProfileBatch } from './lib/openrouter';
import { buildSocialGraph } from './lib/socialGraph';
import type { SeedData, SeedNiche, SeedPost, SeedProfile } from './types';

const NICHES: SeedNiche[] = [
   'travel',
   'fitness',
   'food',
   'fashion',
   'art',
   'photography',
   'lifestyle',
   'music',
   'tech',
   'wellness',
];

function randInt(min: number, max: number) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
   const a = [...arr];
   for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
   }
   return a;
}

function pickRandom<T>(arr: T[], count: number): T[] {
   const a = [...arr];
   const n = Math.min(count, a.length);
   for (let i = 0; i < n; i++) {
      const j = i + Math.floor(Math.random() * (a.length - i));
      [a[i], a[j]] = [a[j], a[i]];
   }
   return a.slice(0, n);
}

async function main() {
   for (const [niche, ids] of Object.entries(NICHE_COLLECTIONS)) {
      if (!ids.length) throw new Error(`No Unsplash collections configured for niche: ${niche}`);
   }

   mkdirSync(OUTPUT_DIR, { recursive: true });

   const nicheAssignments: SeedNiche[] = shuffle(
      NICHES.flatMap(niche => Array.from({ length: PROFILE_COUNT / NICHES.length }, () => niche)),
   );

   const imageProfileIndices = new Set(
      shuffle(Array.from({ length: PROFILE_COUNT }, (_, i) => i)).slice(
         0,
         Math.round(PROFILE_COUNT * IMAGE_PROFILE_RATIO),
      ),
   );

   const profiles: SeedProfile[] = [];

   for (let batchStart = 0; batchStart < PROFILE_COUNT; batchStart += AI_BATCH_SIZE) {
      const batchNiches = nicheAssignments.slice(batchStart, batchStart + AI_BATCH_SIZE);
      console.log(`Generating profiles ${batchStart + 1}–${batchStart + batchNiches.length}...`);

      let raw = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
         try {
            raw = await generateProfileBatch(batchNiches, batchNiches.length);
            break;
         } catch (err) {
            console.warn(`Batch attempt ${attempt}/3 failed: ${err instanceof Error ? err.message : err}`);
            if (attempt === 3) throw err;
         }
      }
      if (!raw) throw new Error('Batch failed after 3 attempts');

      for (let i = 0; i < batchNiches.length; i++) {
         const profileIndex = batchStart + i;
         const r = raw[i];
         const niche = batchNiches[i];
         const hasImages = imageProfileIndices.has(profileIndex);
         const postCount = randInt(POSTS_PER_PROFILE.min, POSTS_PER_PROFILE.max);
         const storyCount = randInt(STORIES_PER_PROFILE.min, STORIES_PER_PROFILE.max);
         const highlightCount = randInt(HIGHLIGHTS_PER_PROFILE.min, HIGHLIGHTS_PER_PROFILE.max);

         const posts: SeedPost[] = r.posts.slice(0, postCount).map(p => {
            const imageCount = hasImages ? randInt(IMAGES_PER_POST.min, IMAGES_PER_POST.max) : 0;
            return {
               id: randomUUID(),
               caption: p.caption,
               aspectRatio: (['1:1', '4:5', '16:9', '9:16'].includes(p.aspect_ratio)
                  ? p.aspect_ratio
                  : '1:1') as SeedPost['aspectRatio'],
               imageCount,
               images: Array.from({ length: imageCount }, () => null),
               collaboratorProfileIds: [],
               imageTags: [],
            };
         });

         const stories = r.stories.slice(0, storyCount).map(s => ({
            id: randomUUID(),
            description: s.description,
            hasImage: hasImages,
            image: null,
         }));

         const highlights = r.highlights.slice(0, highlightCount).map(h => ({
            id: randomUUID(),
            title: h.title.slice(0, 15),
            storyIds: h.story_indices
               .filter(idx => idx < stories.length)
               .slice(0, 3)
               .map(idx => stories[idx].id),
         }));

         profiles.push({
            id: randomUUID(),
            niche,
            username: r.username,
            fullName: r.full_name,
            bio: r.bio,
            website: Math.random() < WEBSITE_PROBABILITY ? (r.website ?? null) : null,
            isVerified: Math.random() < VERIFIED_PROBABILITY,
            isPrivate: Math.random() < PRIVATE_PROBABILITY,
            hasImages,
            commentPool: r.comment_pool ?? [],
            posts,
            stories,
            highlights,
            avatar: null,
         });
      }
   }

   const nicheProfiles = new Map<SeedNiche, SeedProfile[]>();
   for (const p of profiles) {
      const g = nicheProfiles.get(p.niche) ?? [];
      g.push(p);
      nicheProfiles.set(p.niche, g);
   }

   for (const profile of profiles) {
      const sameNiche = (nicheProfiles.get(profile.niche) ?? []).filter(p => p.id !== profile.id);
      const otherProfiles = profiles.filter(p => p.id !== profile.id);

      for (const post of profile.posts) {
         if (Math.random() < 0.4) {
            const pool = Math.random() < SAME_NICHE_WEIGHT ? sameNiche : otherProfiles;
            post.collaboratorProfileIds = pickRandom(pool, randInt(1, 2)).map(p => p.id);
         }
         if (Math.random() < 0.5 && post.imageCount > 0) {
            const pool = Math.random() < SAME_NICHE_WEIGHT ? sameNiche : otherProfiles;
            post.imageTags = pickRandom(pool, randInt(1, 3)).map(p => ({
               profileId: p.id,
               x: Math.random() * 0.8 + 0.1,
               y: Math.random() * 0.8 + 0.1,
            }));
         }
      }
   }

   const graph = buildSocialGraph(profiles);
   const data: SeedData = { profiles, graph };

   writeFileSync(PROFILES_JSON, JSON.stringify(data, null, 2));
   console.log(`✓ Wrote ${profiles.length} profiles → ${PROFILES_JSON}`);
   console.log(
      `  Follows: ${graph.follows.length}, Likes: ${graph.likes.length}, Comments: ${graph.comments.length}`,
   );
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
