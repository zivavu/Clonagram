import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { IMAGES_DIR, PROFILES_JSON, SEED_CONCURRENCY } from './helpers/config';
import { createMuxAssetFromUrl } from './lib/muxAdmin';
import { supabase } from './lib/supabaseAdmin';
import type { SeedComment, SeedData, SeedProfile } from './types';

function randomPastDate(maxDaysAgo: number) {
   const d = new Date();
   d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysAgo));
   return d.toISOString();
}

function randomPostDate() {
   const now = Date.now();
   const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;
   const t = 1 - Math.random() ** 2;
   const jitter = (Math.random() - 0.5) * 2 * 60 * 60 * 1000;
   return new Date(twoYearsAgo + t * (now - twoYearsAgo) + jitter).toISOString();
}

async function uploadFile(bucket: string, path: string, buffer: Buffer, contentType: string) {
   // Uploads are idempotent (upsert), so retry transient network errors
   // (e.g. socket closed) instead of failing the whole seed run.
   for (let attempt = 1; ; attempt++) {
      const { error } = await supabase.storage
         .from(bucket)
         .upload(path, buffer, { contentType, upsert: true });
      if (!error) return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      if (attempt >= 5)
         throw new Error(
            `Upload failed (${bucket}/${path}) after ${attempt} attempts: ${error.message}`,
         );
      await new Promise(r => setTimeout(r, attempt * 1000));
   }
}

// Strip unpaired UTF-16 surrogates, which serialize to invalid UTF-8 and make
// PostgREST reject the request body with 400 "Empty or invalid json".
function stripLoneSurrogates(s: string): string {
   return s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
}

// Supabase requests can fail transiently under load (socket closed, empty/invalid
// json from the gateway). Retry the operation a few times before giving up.
async function withRetry<T extends { error: unknown }>(
   op: () => PromiseLike<T>,
   label: string,
): Promise<T> {
   let lastMsg = '';
   for (let attempt = 1; attempt <= 5; attempt++) {
      try {
         const res = await op();
         if (!res.error) return res;
         lastMsg = (res.error as { message?: string })?.message ?? String(res.error);
      } catch (err) {
         lastMsg = err instanceof Error ? err.message : String(err);
      }
      if (attempt < 5) await new Promise(r => setTimeout(r, attempt * 1000));
   }
   throw new Error(`${label} failed after 5 attempts: ${lastMsg}`);
}

const END_DATE = new Date('2028-12-31T23:59:59Z').getTime();
const postFirstImageId = new Map<string, string>();
const postCreatedAt = new Map<string, string>();

function bar(done: number, total: number, width = 10): string {
   const filled = total === 0 ? 0 : Math.min(width, Math.floor((done / total) * width));
   return '━'.repeat(filled) + '─'.repeat(width - filled);
}

class ProfileProgress {
   posts = { done: 0, total: 0 };
   stories = { done: 0, total: 0 };
   reels = { done: 0, total: 0 };

   constructor(
      public readonly username: string,
      private display: ProgressDisplay,
   ) {}

   init(posts: number, stories: number, reels: number) {
      this.posts.total = posts;
      this.stories.total = stories;
      this.reels.total = reels;
      this.display.render();
   }

   tick(field: 'posts' | 'stories' | 'reels') {
      this[field].done++;
      this.display.render();
   }

   line(): string {
      const b = (s: { done: number; total: number }) =>
         `[${bar(s.done, s.total, 6)}] ${String(s.done).padStart(2)}/${s.total}`;
      return `  @${this.username.padEnd(20)} Posts${b(this.posts)}  Stories${b(this.stories)}  Reels${b(this.reels)}`;
   }
}

class ProgressDisplay {
   private slots: (ProfileProgress | null)[];
   private firstRender = true;

   constructor(size: number) {
      this.slots = Array(size).fill(null);
   }

   allocate(progress: ProfileProgress): number {
      const i = this.slots.indexOf(null);
      if (i === -1) throw new Error('No free slot in ProgressDisplay');
      this.slots[i] = progress;
      return i;
   }

   free(index: number) {
      this.slots[index] = null;
      this.render();
   }

   render() {
      if (!this.firstRender) process.stdout.write(`\x1b[${this.slots.length}A`);
      this.firstRender = false;
      for (const slot of this.slots) {
         process.stdout.write(`\x1b[2K${slot ? slot.line() : ''}\n`);
      }
   }
}

async function seedProfile(profile: SeedProfile, display: ProgressDisplay) {
   const { data: existingUser } = await supabase.auth.admin.getUserById(profile.id);
   if (existingUser.user) return;

   const progress = new ProfileProgress(profile.username, display);
   const slotIndex = display.allocate(progress);
   try {
      const postCount = profile.posts.filter(p => p.images.length > 0).length;
      const storyCount = profile.stories.filter(s => s.hasImage && s.image).length;
      const reelCount = profile.reels.filter(r => r.pexelsVideoUrl).length;
      progress.init(postCount, storyCount, reelCount);

      const { error: authError } = await supabase.auth.admin.createUser({
         id: profile.id,
         email: `ai.${profile.id}@clonagram.seed`,
         password: randomUUID(),
         email_confirm: true,
      });
      if (authError) throw new Error(`Auth createUser: ${authError.message}`);

      let avatarUrl: string | null = null;
      const avatarPath = `${IMAGES_DIR}/${profile.id}/avatar.webp`;
      if (existsSync(avatarPath)) {
         avatarUrl = await uploadFile(
            'avatars',
            `${profile.id}/avatar.webp`,
            readFileSync(avatarPath),
            'image/webp',
         );
      }

      const { error: profileError } = await supabase.from('profiles').upsert({
         id: profile.id,
         username: profile.username,
         full_name: profile.fullName,
         bio: profile.bio,
         website: profile.website,
         avatar_url: avatarUrl,
         avatar_attribution: profile.avatar?.attribution ?? null,
         is_ai: true,
      });
      if (profileError) throw new Error(`Profile upsert: ${profileError.message}`);

      await Promise.all(
         profile.posts.map(async (post, pi) => {
            if (!post.images.length) return;
            const createdAt = randomPostDate();
            postCreatedAt.set(post.id, createdAt);

            await withRetry(
               () =>
                  supabase.from('posts').insert({
                     id: post.id,
                     user_id: profile.id,
                     caption: post.caption,
                     type: 'photo',
                     aspect_ratio: post.aspectRatio,
                     is_ai: true,
                     created_at: createdAt,
                  }),
               'Post insert',
            );

            await Promise.all(
               post.images.map(async (imageMeta, ii) => {
                  if (!imageMeta) return;
                  const localPath = `${IMAGES_DIR}/${profile.id}/post_${pi}_${ii}.webp`;
                  if (!existsSync(localPath)) return;

                  const imageUrl = await uploadFile(
                     'posts',
                     `${profile.id}/${post.id}/${ii}.webp`,
                     readFileSync(localPath),
                     'image/webp',
                  );

                  const { data: imageData } = await withRetry(
                     () =>
                        supabase
                           .from('post_images')
                           .insert({
                              post_id: post.id,
                              position: ii,
                              url: imageUrl,
                              width: imageMeta.width,
                              height: imageMeta.height,
                              blur_data_url: imageMeta.blurDataUrl,
                              unsplash_attribution: imageMeta.attribution ?? null,
                              alt_text: imageMeta.altText ?? null,
                           })
                           .select('id')
                           .single(),
                     'post_images insert',
                  );

                  if (ii === 0 && imageData) postFirstImageId.set(post.id, imageData.id);
               }),
            );
            progress.tick('posts');
         }),
      );

      await Promise.all([
         Promise.all(
            profile.stories.map(async (story, si) => {
               const createdAt = randomPastDate(730);

               await withRetry(
                  () =>
                     supabase.from('stories').insert({
                        id: story.id,
                        user_id: profile.id,
                        is_ai: true,
                        created_at: createdAt,
                     }),
                  'Story insert',
               );

               if (story.hasImage && story.image) {
                  const storyImage = story.image;
                  const localPath = `${IMAGES_DIR}/${profile.id}/story_${si}.webp`;
                  if (existsSync(localPath)) {
                     const storyUrl = await uploadFile(
                        'stories',
                        `${profile.id}/${story.id}/0.webp`,
                        readFileSync(localPath),
                        'image/webp',
                     );
                     await withRetry(
                        () =>
                           supabase.from('story_images').insert({
                              story_id: story.id,
                              position: 0,
                              url: storyUrl,
                              blur_data_url: storyImage.blurDataUrl,
                              unsplash_attribution: storyImage.attribution ?? null,
                           }),
                        'story_images insert',
                     );
                  }
               }
               if (story.hasImage && story.image) progress.tick('stories');
            }),
         ),
         Promise.all(
            profile.reels.map(async reel => {
               if (!reel.pexelsVideoUrl) return;

               const createdAt = randomPostDate();
               postCreatedAt.set(reel.id, createdAt);

               await withRetry(
                  () =>
                     supabase.from('posts').insert({
                        id: reel.id,
                        user_id: profile.id,
                        caption: reel.caption,
                        type: 'reel',
                        aspect_ratio: '9:16',
                        is_ai: true,
                        created_at: createdAt,
                     }),
                  'Reel post insert',
               );

               const muxAsset = await createMuxAssetFromUrl(reel.pexelsVideoUrl);

               await withRetry(
                  () =>
                     supabase.from('post_videos').insert({
                        post_id: reel.id,
                        position: 0,
                        mux_asset_id: muxAsset.assetId,
                        mux_playback_id: muxAsset.playbackId,
                        mux_status: 'ready',
                        duration: muxAsset.duration,
                        width: reel.width,
                        height: reel.height,
                     }),
                  'post_videos insert',
               );

               progress.tick('reels');
            }),
         ),
      ]);

      const storiesWithMedia = new Set(
         profile.stories
            .filter(
               (s, si) =>
                  s.hasImage &&
                  s.image &&
                  existsSync(`${IMAGES_DIR}/${profile.id}/story_${si}.webp`),
            )
            .map(s => s.id),
      );

      const seenTitles = new Set<string>();
      const uniqueHighlights = profile.highlights.filter(h => {
         const key = h.title.toLowerCase();
         if (seenTitles.has(key)) return false;
         seenTitles.add(key);
         return true;
      });

      const storyPool = [...storiesWithMedia].sort(() => Math.random() - 0.5);
      const chunkSize = Math.max(
         2,
         Math.floor(storyPool.length / Math.max(1, uniqueHighlights.length)),
      );
      const highlightsWithStories = uniqueHighlights
         .map((h, i) => ({
            ...h,
            storyIds: storyPool.slice(i * chunkSize, (i + 1) * chunkSize),
         }))
         .filter(h => h.storyIds.length >= 2);

      await Promise.all(
         highlightsWithStories.map(async highlight => {
            const validStoryIds = highlight.storyIds;
            if (validStoryIds.length === 0) return;

            await withRetry(
               () =>
                  supabase.from('story_highlights').insert({
                     id: highlight.id,
                     user_id: profile.id,
                     title: stripLoneSurrogates(highlight.title),
                     is_ai: true,
                  }),
               'Highlight insert',
            );

            const items = validStoryIds.map((storyId, pos) => ({
               story_id: storyId,
               highlight_id: highlight.id,
               position: pos,
            }));
            await withRetry(
               () => supabase.from('story_highlight_items').insert(items),
               'story_highlight_items insert',
            );
         }),
      );
   } finally {
      display.free(slotIndex);
   }
}

async function insertBatch<T extends object>(table: string, rows: T[], batchSize = 500) {
   for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      await withRetry(() => supabase.from(table).insert(batch), `${table} batch insert`);
   }
}

async function main() {
   const data: SeedData = JSON.parse(readFileSync(PROFILES_JSON, 'utf-8'));

   const display = new ProgressDisplay(SEED_CONCURRENCY);
   const queue = [...data.profiles];
   async function worker() {
      while (queue.length > 0) {
         const profile = queue.shift();
         if (!profile) break;
         await seedProfile(profile, display);
      }
   }
   await Promise.all(Array.from({ length: SEED_CONCURRENCY }, worker));

   // Contextual comments are authored by other profiles, so they can only be
   // inserted once every profile's user row exists (after the barrier above).
   const contextualCommentRows = data.profiles.flatMap(profile => {
      const otherProfiles = data.profiles.filter(p => p.id !== profile.id);
      return profile.posts
         .filter(p => p.contextualComments.length > 0 && p.images.length > 0)
         .flatMap(post => {
            const commenters = [...otherProfiles]
               .sort(() => Math.random() - 0.5)
               .slice(0, post.contextualComments.length);
            const postDate = new Date(postCreatedAt.get(post.id) ?? new Date()).getTime();
            return post.contextualComments.map((text, idx) => ({
               id: randomUUID(),
               post_id: post.id,
               user_id: commenters[idx % commenters.length].id,
               content: text || 'Love this!',
               is_ai: true,
               created_at: new Date(
                  postDate + (idx + 1) * 30 * 60 * 1000 + Math.random() * 60 * 60 * 1000,
               ).toISOString(),
               parent_id: null,
            }));
         });
   });
   await insertBatch('comments', contextualCommentRows);

   console.log('Seeding social graph...');

   await insertBatch(
      'follows',
      data.graph.follows.map(f => ({
         follower_id: f.followerId,
         following_id: f.followingId,
         status: 'accepted',
      })),
   );

   await insertBatch(
      'likes',
      data.graph.likes.map(l => {
         const postDate = new Date(postCreatedAt.get(l.postId) ?? new Date()).getTime();
         return {
            post_id: l.postId,
            user_id: l.profileId,
            created_at: new Date(postDate + Math.random() * (END_DATE - postDate)).toISOString(),
         };
      }),
   );

   await insertBatch(
      'saves',
      data.graph.saves.map(s => {
         const postDate = new Date(postCreatedAt.get(s.postId) ?? new Date()).getTime();
         return {
            post_id: s.postId,
            user_id: s.profileId,
            created_at: new Date(postDate + Math.random() * (END_DATE - postDate)).toISOString(),
         };
      }),
   );

   await insertBatch(
      'reposts',
      data.graph.reposts.map(r => {
         const postDate = new Date(postCreatedAt.get(r.postId) ?? new Date()).getTime();
         return {
            post_id: r.postId,
            user_id: r.profileId,
            created_at: new Date(postDate + Math.random() * (END_DATE - postDate)).toISOString(),
         };
      }),
   );

   const commentDates = new Map<string, number>();

   const topLevelComments = data.graph.comments.filter(c => !c.parentId);
   const replyComments = data.graph.comments.filter(
      (c): c is SeedComment & { parentId: string } => !!c.parentId,
   );

   await insertBatch(
      'comments',
      topLevelComments.map(c => {
         const postDate = new Date(postCreatedAt.get(c.postId) ?? new Date()).getTime();
         const date = postDate + Math.random() * 5 * 24 * 60 * 60 * 1000;
         commentDates.set(c.id, date);
         return {
            id: c.id,
            post_id: c.postId,
            user_id: c.authorProfileId,
            content: c.text || 'Love this!',
            is_ai: true,
            created_at: new Date(date).toISOString(),
            parent_id: null,
         };
      }),
   );

   await insertBatch(
      'comments',
      replyComments.map(c => {
         const parentDate =
            commentDates.get(c.parentId) ??
            new Date(postCreatedAt.get(c.postId) ?? new Date()).getTime();
         const date = parentDate + Math.random() * 24 * 60 * 60 * 1000;
         commentDates.set(c.id, date);
         return {
            id: c.id,
            post_id: c.postId,
            user_id: c.authorProfileId,
            content: c.text || 'Love this!',
            is_ai: true,
            created_at: new Date(date).toISOString(),
            parent_id: c.parentId,
         };
      }),
   );

   const replyCountsByComment = new Map<string, number>();
   for (const c of replyComments) {
      if (c.parentId) {
         replyCountsByComment.set(c.parentId, (replyCountsByComment.get(c.parentId) ?? 0) + 1);
      }
   }
   const parentCommentIds = [...replyCountsByComment.keys()];
   for (let i = 0; i < parentCommentIds.length; i += 20) {
      await Promise.all(
         parentCommentIds.slice(i, i + 20).map(commentId =>
            supabase
               .from('comments')
               .update({ reply_count: replyCountsByComment.get(commentId) ?? 0 })
               .eq('id', commentId),
         ),
      );
   }

   const collabRows = data.profiles.flatMap(p =>
      p.posts.flatMap(post =>
         post.collaboratorProfileIds.map(collab => ({
            post_id: post.id,
            user_id: collab,
         })),
      ),
   );
   await insertBatch('post_collaborators', collabRows);

   const tagRows = data.profiles.flatMap(p =>
      p.posts.flatMap(post => {
         const imageId = postFirstImageId.get(post.id);
         if (!imageId) return [];
         return post.imageTags.map(tag => ({
            image_id: imageId,
            user_id: tag.profileId,
            x: tag.x,
            y: tag.y,
         }));
      }),
   );
   await insertBatch('post_image_tags', tagRows);

   console.log('\nUpdating post counts...');
   const likeCounts = new Map<string, number>();
   const commentCounts = new Map<string, number>();
   const repostCounts = new Map<string, number>();
   for (const l of data.graph.likes) likeCounts.set(l.postId, (likeCounts.get(l.postId) ?? 0) + 1);
   for (const c of data.graph.comments)
      commentCounts.set(c.postId, (commentCounts.get(c.postId) ?? 0) + 1);
   for (const r of data.graph.reposts)
      repostCounts.set(r.postId, (repostCounts.get(r.postId) ?? 0) + 1);

   const postIds = data.profiles.flatMap(p => [
      ...p.posts.map(post => post.id),
      ...p.reels.map(reel => reel.id),
   ]);
   for (let i = 0; i < postIds.length; i += 20) {
      await Promise.all(
         postIds.slice(i, i + 20).map(postId =>
            supabase
               .from('posts')
               .update({
                  like_count: likeCounts.get(postId) ?? 0,
                  comment_count: commentCounts.get(postId) ?? 0,
                  repost_count: repostCounts.get(postId) ?? 0,
               })
               .eq('id', postId),
         ),
      );
   }

   console.log('✓ Seeding complete!');
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
