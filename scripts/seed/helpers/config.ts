import { join } from 'node:path';
import type { SeedArchetype } from '../types';

export const PROFILE_COUNT = 20;
export const IMAGE_PROFILE_RATIO = 1;
export const WEBSITE_PROBABILITY = 0.7;
export const SAME_NICHE_WEIGHT = 0.7;
export const IMAGE_CONCURRENCY = 5;
export const WEBP_QUALITY = 85;
export const BLUR_WIDTH = 20;
export const AI_BATCH_SIZE = 5;
export const SEED_CONCURRENCY = 5;
export const SAVE_RATIO = 0.25;
export const REPOST_RATIO = 0.08;
export const EXPLORE_ENGAGEMENT_RATIO = 0.3;
export const OUTPUT_DIR = join(import.meta.dirname, '..', 'output');
export const IMAGES_DIR = join(OUTPUT_DIR, 'images');
export const PROFILES_JSON = join(OUTPUT_DIR, 'profiles.json');

export const IMAGES_PER_POST = { min: 1, max: 5 };

export const ARCHETYPE_DISTRIBUTION: Record<SeedArchetype, number> = {
   influencer: 0.15,
   regular: 0.5,
   lurker: 0.2,
   dormant: 0.15,
};

export const ARCHETYPE_POSTS: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 20, max: 35 },
   regular: { min: 8, max: 20 },
   lurker: { min: 1, max: 5 },
   dormant: { min: 0, max: 2 },
};

export const ARCHETYPE_STORIES: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 15, max: 25 },
   regular: { min: 6, max: 15 },
   lurker: { min: 2, max: 8 },
   dormant: { min: 0, max: 3 },
};

export const ARCHETYPE_HIGHLIGHTS: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 4, max: 8 },
   regular: { min: 2, max: 5 },
   lurker: { min: 0, max: 2 },
   dormant: { min: 0, max: 1 },
};

export const ARCHETYPE_FOLLOWS: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 10, max: 40 },
   regular: { min: 25, max: 60 },
   lurker: { min: 60, max: 150 },
   dormant: { min: 5, max: 25 },
};

export const ARCHETYPE_LIKES: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 20, max: 60 },
   regular: { min: 60, max: 150 },
   lurker: { min: 100, max: 250 },
   dormant: { min: 5, max: 30 },
};

export const ARCHETYPE_COMMENTS: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 10, max: 30 },
   regular: { min: 20, max: 50 },
   lurker: { min: 30, max: 80 },
   dormant: { min: 2, max: 15 },
};

export const ARCHETYPE_REELS: Record<SeedArchetype, { min: number; max: number }> = {
   influencer: { min: 2, max: 5 },
   regular: { min: 0, max: 2 },
   lurker: { min: 0, max: 0 },
   dormant: { min: 0, max: 0 },
};
