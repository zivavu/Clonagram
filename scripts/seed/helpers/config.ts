import { join } from 'path';

export const PROFILE_COUNT = 60;
export const IMAGE_PROFILE_RATIO = 1;
export const WEBSITE_PROBABILITY = 0.7;
export const VERIFIED_PROBABILITY = 0.1;
export const PRIVATE_PROBABILITY = 0.15;
export const POSTS_PER_PROFILE = { min: 8, max: 30 };
export const STORIES_PER_PROFILE = { min: 8, max: 20 };
export const HIGHLIGHTS_PER_PROFILE = { min: 2, max: 6 };
export const IMAGES_PER_POST = { min: 1, max: 5 };
export const FOLLOWS_PER_PROFILE = { min: 25, max: 60 };
export const LIKES_PER_PROFILE = { min: 60, max: 150 };
export const COMMENTS_PER_PROFILE = { min: 20, max: 50 };
export const SAME_NICHE_WEIGHT = 0.7;
export const IMAGE_CONCURRENCY = 5;
export const WEBP_QUALITY = 85;
export const BLUR_WIDTH = 20;
export const AI_BATCH_SIZE = 5;
export const SEED_CONCURRENCY = 5;
export const SAVE_RATIO = 0.25;
export const REPOST_RATIO = 0.08;
// Fraction of likes/comments that come from non-followers (explore-page effect)
export const EXPLORE_ENGAGEMENT_RATIO = 0.3;
export const OUTPUT_DIR = join(import.meta.dirname, 'output');
export const IMAGES_DIR = join(OUTPUT_DIR, 'images');
export const PROFILES_JSON = join(OUTPUT_DIR, 'profiles.json');
