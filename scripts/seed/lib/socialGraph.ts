import { randomUUID } from 'crypto';
import {
   COMMENTS_PER_PROFILE,
   FOLLOWS_PER_PROFILE,
   LIKES_PER_PROFILE,
   REPOST_RATIO,
   SAME_NICHE_WEIGHT,
   SAVE_RATIO,
} from '../helpers/config';
import type { SeedGraph, SeedNiche, SeedProfile } from '../types';

function randInt(min: number, max: number) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
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

function randomPastDate(maxDaysAgo: number): string {
   const d = new Date();
   d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysAgo));
   d.setHours(randInt(6, 22), randInt(0, 59), randInt(0, 59));
   return d.toISOString();
}

export function buildSocialGraph(profiles: SeedProfile[]): SeedGraph {
   const nicheGroups = new Map<SeedNiche, SeedProfile[]>();
   for (const p of profiles) {
      const group = nicheGroups.get(p.niche) ?? [];
      group.push(p);
      nicheGroups.set(p.niche, group);
   }

   type PostRef = { postId: string; ownerId: string };
   const allPosts: PostRef[] = profiles.flatMap(p =>
      p.posts.map(post => ({ postId: post.id, ownerId: p.id })),
   );

   const follows: SeedGraph['follows'] = [];
   const likes: SeedGraph['likes'] = [];
   const saves: SeedGraph['saves'] = [];
   const reposts: SeedGraph['reposts'] = [];
   const comments: SeedGraph['comments'] = [];

   for (const profile of profiles) {
      const sameNiche = (nicheGroups.get(profile.niche) ?? []).filter(p => p.id !== profile.id);
      const otherNiche = profiles.filter(p => p.niche !== profile.niche);

      const followCount = randInt(FOLLOWS_PER_PROFILE.min, FOLLOWS_PER_PROFILE.max);
      const sameCount = Math.round(followCount * SAME_NICHE_WEIGHT);
      const otherCount = followCount - sameCount;

      const followed = [...pickRandom(sameNiche, sameCount), ...pickRandom(otherNiche, otherCount)];

      for (const target of followed) {
         follows.push({ followerId: profile.id, followingId: target.id });
      }

      const followedIds = new Set(followed.map(p => p.id));
      const followedPosts = allPosts.filter(p => followedIds.has(p.ownerId));

      const likeCount = randInt(LIKES_PER_PROFILE.min, LIKES_PER_PROFILE.max);
      const likedPosts = pickRandom(followedPosts, likeCount);
      for (const { postId } of likedPosts) {
         likes.push({ postId, profileId: profile.id, createdAt: randomPastDate(180) });
      }

      const savedPosts = pickRandom(likedPosts, Math.round(likedPosts.length * SAVE_RATIO));
      for (const { postId } of savedPosts) {
         saves.push({ postId, profileId: profile.id, createdAt: randomPastDate(180) });
      }

      const repostedPosts = pickRandom(likedPosts, Math.round(likedPosts.length * REPOST_RATIO));
      for (const { postId } of repostedPosts) {
         reposts.push({ postId, profileId: profile.id, createdAt: randomPastDate(180) });
      }

      const commentCount = randInt(COMMENTS_PER_PROFILE.min, COMMENTS_PER_PROFILE.max);
      const commentTargets = pickRandom(followedPosts, commentCount);
      const commentTexts = [...profile.commentPool].sort(() => Math.random() - 0.5);

      for (let i = 0; i < commentTargets.length; i++) {
         comments.push({
            id: randomUUID(),
            postId: commentTargets[i].postId,
            authorProfileId: profile.id,
            text: commentTexts[i % commentTexts.length],
            createdAt: randomPastDate(180),
         });
      }
   }

   return { follows, likes, saves, reposts, comments };
}
