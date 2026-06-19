import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { NICHE_COLLECTIONS } from './helpers/collections';
import {
   AI_BATCH_SIZE,
   ARCHETYPE_DISTRIBUTION,
   ARCHETYPE_HIGHLIGHTS,
   ARCHETYPE_POSTS,
   ARCHETYPE_REELS,
   ARCHETYPE_STORIES,
   IMAGE_PROFILE_RATIO,
   IMAGES_PER_POST,
   OUTPUT_DIR,
   PROFILE_COUNT,
   PROFILES_JSON,
   SAME_NICHE_WEIGHT,
   WEBSITE_PROBABILITY,
} from './helpers/config';
import { generateProfileBatch } from './lib/openrouter';
import { buildSocialGraph } from './lib/socialGraph';
import type { SeedArchetype, SeedData, SeedNiche, SeedPost, SeedProfile, SeedReel } from './types';

const ASPECT_RATIOS: SeedPost['aspectRatio'][] = [
   '1:1',
   '1:1',
   '1:1',
   '4:5',
   '4:5',
   '16:9',
   '9:16',
];

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

async function verifyWebsite(url: string): Promise<boolean> {
   try {
      const res = await fetch(url, {
         method: 'HEAD',
         signal: AbortSignal.timeout(5000),
         redirect: 'follow',
      });
      return res.ok || res.status < 500;
   } catch {
      return false;
   }
}

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

function assignArchetypes(count: number): SeedArchetype[] {
   const counts = {
      influencer: Math.round(count * ARCHETYPE_DISTRIBUTION.influencer),
      regular: Math.round(count * ARCHETYPE_DISTRIBUTION.regular),
      lurker: Math.round(count * ARCHETYPE_DISTRIBUTION.lurker),
      dormant: Math.round(count * ARCHETYPE_DISTRIBUTION.dormant),
   };
   const total = Object.values(counts).reduce((a, b) => a + b, 0);
   counts.regular += count - total;

   const pool: SeedArchetype[] = [];
   for (const [archetype, n] of Object.entries(counts) as [SeedArchetype, number][]) {
      for (let i = 0; i < n; i++) pool.push(archetype);
   }
   return shuffle(pool);
}

async function main() {
   for (const [niche, ids] of Object.entries(NICHE_COLLECTIONS)) {
      if (!ids.length) throw new Error(`No Unsplash collections configured for niche: ${niche}`);
   }

   mkdirSync(OUTPUT_DIR, { recursive: true });

   const nicheAssignments: SeedNiche[] = shuffle(
      NICHES.flatMap(niche => Array.from({ length: PROFILE_COUNT / NICHES.length }, () => niche)),
   );

   const archetypeAssignments = assignArchetypes(PROFILE_COUNT);

   const imageProfileIndices = new Set(
      shuffle(Array.from({ length: PROFILE_COUNT }, (_, i) => i)).slice(
         0,
         Math.round(PROFILE_COUNT * IMAGE_PROFILE_RATIO),
      ),
   );

   const profiles: SeedProfile[] = [];

   for (let batchStart = 0; batchStart < PROFILE_COUNT; batchStart += AI_BATCH_SIZE) {
      const batchNiches = nicheAssignments.slice(batchStart, batchStart + AI_BATCH_SIZE);
      const batchArchetypes = archetypeAssignments.slice(batchStart, batchStart + AI_BATCH_SIZE);
      console.log(`Generating profiles ${batchStart + 1}–${batchStart + batchNiches.length}...`);

      const batchSpecs = batchNiches.map((niche, i) => ({
         niche,
         archetype: batchArchetypes[i],
      }));

      let raw = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
         try {
            raw = await generateProfileBatch(batchSpecs);
            break;
         } catch (err) {
            console.warn(
               `Batch attempt ${attempt}/3 failed: ${err instanceof Error ? err.message : err}`,
            );
            if (attempt === 3) throw err;
         }
      }
      if (!raw) throw new Error('Batch failed after 3 attempts');

      for (let i = 0; i < batchNiches.length; i++) {
         const profileIndex = batchStart + i;
         const r = raw[i];
         const niche = batchNiches[i];
         const archetype = batchArchetypes[i];
         const hasImages = imageProfileIndices.has(profileIndex);

         const postCount = randInt(ARCHETYPE_POSTS[archetype].min, ARCHETYPE_POSTS[archetype].max);
         const storyCount = randInt(
            ARCHETYPE_STORIES[archetype].min,
            ARCHETYPE_STORIES[archetype].max,
         );
         const highlightCount = randInt(
            ARCHETYPE_HIGHLIGHTS[archetype].min,
            ARCHETYPE_HIGHLIGHTS[archetype].max,
         );
         const reelCount = randInt(ARCHETYPE_REELS[archetype].min, ARCHETYPE_REELS[archetype].max);

         const posts: SeedPost[] = r.posts.slice(0, postCount).map(p => {
            const imageCount = hasImages ? randInt(IMAGES_PER_POST.min, IMAGES_PER_POST.max) : 0;
            return {
               id: randomUUID(),
               caption: p.caption,
               aspectRatio: ASPECT_RATIOS[Math.floor(Math.random() * ASPECT_RATIOS.length)],
               imageCount,
               images: Array.from({ length: imageCount }, () => null),
               collaboratorProfileIds: [],
               imageTags: [],
               contextualComments: [],
            };
         });

         const stories = r.stories.slice(0, storyCount).map(s => ({
            id: randomUUID(),
            description: s.description,
            hasImage: hasImages,
            image: null,
         }));

         const storyIndices = Array.from({ length: stories.length }, (_, idx) => idx);
         const highlights = r.highlights
            .filter(h => h?.title)
            .slice(0, highlightCount)
            .map(h => ({
               id: randomUUID(),
               title: h.title.slice(0, 15),
               storyIds: pickRandom(storyIndices, randInt(2, Math.min(6, stories.length))).map(
                  idx => stories[idx].id,
               ),
            }));

         const reels: SeedReel[] = r.reels.slice(0, reelCount).map(rl => ({
            id: randomUUID(),
            caption: rl.caption,
            pexelsVideoUrl: null,
            width: null,
            height: null,
            duration: null,
         }));

         let website: string | null = null;
         if (Math.random() < WEBSITE_PROBABILITY && r.website) {
            const url = r.website.startsWith('http') ? r.website : `https://${r.website}`;
            const alive = await verifyWebsite(url);
            website = alive ? url : null;
         }

         profiles.push({
            id: randomUUID(),
            niche,
            archetype,
            username: r.username,
            fullName: r.full_name,
            bio: r.bio,
            website,
            hasImages,
            commentPool: r.comment_pool ?? [],
            posts,
            stories,
            highlights,
            avatar: null,
            reels,
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
