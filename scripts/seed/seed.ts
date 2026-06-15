import { randomUUID } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { IMAGES_DIR, PROFILES_JSON } from './config';
import { generateAltText } from './lib/openrouter';
import { supabase } from './lib/supabaseAdmin';
import type { SeedData, SeedProfile } from './types';

function randomPastDate(maxDaysAgo: number) {
   const d = new Date();
   d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysAgo));
   return d.toISOString();
}

function randomPostDate() {
   const from = new Date();
   from.setFullYear(from.getFullYear() - 2);
   const to = new Date('2028-12-31T23:59:59Z');
   return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime())).toISOString();
}

async function uploadFile(bucket: string, path: string, buffer: Buffer, contentType: string) {
   const { error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, { contentType, upsert: true });
   if (error) throw new Error(`Upload failed (${bucket}/${path}): ${error.message}`);
   return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

const END_DATE = new Date('2028-12-31T23:59:59Z').getTime();
const postFirstImageId = new Map<string, string>();
const postCreatedAt = new Map<string, string>();

async function seedProfile(profile: SeedProfile) {
   const { data: existingUser } = await supabase.auth.admin.getUserById(profile.id);
   if (existingUser.user) {
      console.log(`Skip ${profile.username} (already seeded)`);
      return;
   }

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
      is_verified: profile.isVerified,
      is_ai: true,
   });
   if (profileError) throw new Error(`Profile upsert: ${profileError.message}`);

   for (let pi = 0; pi < profile.posts.length; pi++) {
      const post = profile.posts[pi];
      if (!post.images.length) continue;
      const createdAt = randomPostDate();
      postCreatedAt.set(post.id, createdAt);

      const { error: postError } = await supabase.from('posts').insert({
         id: post.id,
         user_id: profile.id,
         caption: post.caption,
         type: 'photo',
         aspect_ratio: post.aspectRatio,
         is_ai: true,
         created_at: createdAt,
      });
      if (postError) throw new Error(`Post insert: ${postError.message}`);

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

            const { data: imageData, error: imageError } = await supabase
               .from('post_images')
               .insert({
                  post_id: post.id,
                  position: ii,
                  url: imageUrl,
                  width: imageMeta.width,
                  height: imageMeta.height,
                  blur_data_url: imageMeta.blurDataUrl,
               })
               .select('id')
               .single();
            if (imageError) throw new Error(`post_images insert: ${imageError.message}`);

            if (ii === 0) postFirstImageId.set(post.id, imageData.id);

            try {
               const altText = await generateAltText(imageUrl);
               await supabase.from('post_images').update({ alt_text: altText }).eq('id', imageData.id);
            } catch {
               // alt text is non-critical, continue without it
            }
         }),
      );
   }

   for (let si = 0; si < profile.stories.length; si++) {
      const story = profile.stories[si];
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const createdAt = new Date(oneMonthAgo + Math.random() * (END_DATE - oneMonthAgo)).toISOString();

      const { error: storyError } = await supabase.from('stories').insert({
         id: story.id,
         user_id: profile.id,
         is_ai: true,
         created_at: createdAt,
      });
      if (storyError) throw new Error(`Story insert: ${storyError.message}`);

      if (story.hasImage && story.image) {
         const localPath = `${IMAGES_DIR}/${profile.id}/story_${si}.webp`;
         if (existsSync(localPath)) {
            const storyUrl = await uploadFile(
               'stories',
               `${profile.id}/${story.id}/0.webp`,
               readFileSync(localPath),
               'image/webp',
            );
            const { error: storyImgError } = await supabase.from('story_images').insert({
               story_id: story.id,
               position: 0,
               url: storyUrl,
               blur_data_url: story.image.blurDataUrl,
            });
            if (storyImgError) throw new Error(`story_images insert: ${storyImgError.message}`);
         }
      }
   }

   const storiesWithMedia = new Set(
      profile.stories
         .filter((s, si) => s.hasImage && s.image && existsSync(`${IMAGES_DIR}/${profile.id}/story_${si}.webp`))
         .map(s => s.id),
   );

   for (const highlight of profile.highlights) {
      const validStoryIds = highlight.storyIds.filter(id => storiesWithMedia.has(id));
      if (validStoryIds.length === 0) continue;

      const { error: hlError } = await supabase.from('story_highlights').insert({
         id: highlight.id,
         user_id: profile.id,
         title: highlight.title,
         is_ai: true,
      });
      if (hlError) throw new Error(`Highlight insert: ${hlError.message}`);

      for (let pos = 0; pos < validStoryIds.length; pos++) {
         const { error: itemError } = await supabase.from('story_highlight_items').insert({
            story_id: validStoryIds[pos],
            highlight_id: highlight.id,
            position: pos,
         });
         if (itemError) throw new Error(`story_highlight_items insert: ${itemError.message}`);
      }
   }

   console.log(`✓ ${profile.username}`);
}

async function insertBatch<T extends object>(table: string, rows: T[], batchSize = 500) {
   for (let i = 0; i < rows.length; i += batchSize) {
      const { error } = await supabase.from(table).insert(rows.slice(i, i + batchSize));
      if (error) throw new Error(`${table} batch insert: ${error.message}`);
   }
}

async function main() {
   const data: SeedData = JSON.parse(readFileSync(PROFILES_JSON, 'utf-8'));

   for (const profile of data.profiles) {
      await seedProfile(profile);
   }

   console.log('\nSeeding social graph...');

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

   await insertBatch(
      'comments',
      data.graph.comments.map(c => {
         const postDate = new Date(postCreatedAt.get(c.postId) ?? new Date()).getTime();
         const commentDate = new Date(postDate + Math.random() * (END_DATE - postDate)).toISOString();
         return {
            id: c.id,
            post_id: c.postId,
            user_id: c.authorProfileId,
            content: c.text,
            is_ai: true,
            created_at: commentDate,
         };
      }),
   );

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

   const postIds = data.profiles.flatMap(p => p.posts.map(post => post.id));
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
