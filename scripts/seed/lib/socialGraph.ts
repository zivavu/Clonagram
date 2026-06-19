import { randomUUID } from 'node:crypto';
import {
   ARCHETYPE_COMMENTS,
   ARCHETYPE_FOLLOWS,
   ARCHETYPE_LIKES,
   EXPLORE_ENGAGEMENT_RATIO,
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

// Weighted sampling: posts with higher weight are more likely to be picked,
// simulating power-law engagement distribution (some posts go "viral").
function weightedSample<T>(items: T[], weights: number[], count: number): T[] {
   const result: T[] = [];
   const seen = new Set<number>();
   const total = weights.reduce((a, b) => a + b, 0);
   const n = Math.min(count, items.length);
   while (result.length < n) {
      let r = Math.random() * total;
      for (let i = 0; i < items.length; i++) {
         r -= weights[i];
         if (r <= 0 && !seen.has(i)) {
            seen.add(i);
            result.push(items[i]);
            break;
         }
      }
      // Fallback if floating point drift causes no pick
      if (result.length < seen.size) break;
   }
   return result;
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

   // Assign each post a "popularity" weight using power-law: most posts are ordinary,
   // a few get outsized attention.
   const postWeights = allPosts.map(() => Math.random() ** -1.5);

   const follows: SeedGraph['follows'] = [];
   const likes: SeedGraph['likes'] = [];
   const saves: SeedGraph['saves'] = [];
   const reposts: SeedGraph['reposts'] = [];
   const comments: SeedGraph['comments'] = [];

   for (const profile of profiles) {
      const archetypeFollows = ARCHETYPE_FOLLOWS[profile.archetype];
      const archetypeLikes = ARCHETYPE_LIKES[profile.archetype];
      const archetypeComments = ARCHETYPE_COMMENTS[profile.archetype];

      const sameNiche = (nicheGroups.get(profile.niche) ?? []).filter(p => p.id !== profile.id);
      const otherNiche = profiles.filter(p => p.niche !== profile.niche);

      const followCount = randInt(archetypeFollows.min, archetypeFollows.max);
      const sameCount = Math.round(followCount * SAME_NICHE_WEIGHT);
      const otherCount = followCount - sameCount;

      const followed = [...pickRandom(sameNiche, sameCount), ...pickRandom(otherNiche, otherCount)];
      for (const target of followed) {
         follows.push({ followerId: profile.id, followingId: target.id });
      }

      const followedIds = new Set(followed.map(p => p.id));
      const followedPosts = allPosts.filter(
         p => followedIds.has(p.ownerId) && p.ownerId !== profile.id,
      );
      const followedWeights = followedPosts.map(
         (_, i) => postWeights[allPosts.indexOf(followedPosts[i])],
      );

      // A portion of engagement comes from non-followed posts (explore page)
      const explorePosts = allPosts.filter(
         p => !followedIds.has(p.ownerId) && p.ownerId !== profile.id,
      );
      const exploreWeights = explorePosts.map(
         (_, i) => postWeights[allPosts.indexOf(explorePosts[i])],
      );

      const likeCount = randInt(archetypeLikes.min, archetypeLikes.max);
      const exploreCount = Math.round(likeCount * EXPLORE_ENGAGEMENT_RATIO);
      const followedCount = likeCount - exploreCount;

      const likedFromFeed = weightedSample(followedPosts, followedWeights, followedCount);
      const likedFromExplore = weightedSample(explorePosts, exploreWeights, exploreCount);
      const likedPosts = [...likedFromFeed, ...likedFromExplore];

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

      const commentCount = randInt(archetypeComments.min, archetypeComments.max);
      const exploreCommentCount = Math.round(commentCount * EXPLORE_ENGAGEMENT_RATIO);
      const commentTargets = [
         ...weightedSample(followedPosts, followedWeights, commentCount - exploreCommentCount),
         ...weightedSample(explorePosts, exploreWeights, exploreCommentCount),
      ];
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

   // Add reply threads to a subset of top-level comments on popular posts.
   const commentsByPost = new Map<string, (typeof comments)[number][]>();
   for (const c of comments) {
      const arr = commentsByPost.get(c.postId) ?? [];
      arr.push(c);
      commentsByPost.set(c.postId, arr);
   }

   const profileById = new Map(profiles.map(p => [p.id, p]));

   for (const [, postComments] of commentsByPost) {
      if (postComments.length < 4) continue;

      const replyTargets = pickRandom(postComments, Math.ceil(postComments.length * 0.3));
      for (const parent of replyTargets) {
         const replyCount = randInt(1, 3);
         const repliers = pickRandom(
            profiles.filter(p => p.id !== parent.authorProfileId),
            replyCount,
         );
         for (const replier of repliers) {
            const pool = profileById.get(replier.id)?.commentPool ?? [];
            const text = pool[Math.floor(Math.random() * pool.length)] ?? 'Love this!';
            comments.push({
               id: randomUUID(),
               postId: parent.postId,
               parentId: parent.id,
               authorProfileId: replier.id,
               text,
               createdAt: '',
            });
         }
      }
   }

   return { follows, likes, saves, reposts, comments };
}
