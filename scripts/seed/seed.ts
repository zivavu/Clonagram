import { existsSync, readFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { supabase } from './lib/supabaseAdmin';
import { generateAltText } from './lib/openrouter';
import { IMAGES_DIR, PROFILES_JSON } from './config';
import type { SeedData, SeedProfile } from './types';

function randomPastDate(maxDaysAgo: number) {
   const d = new Date();
   d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysAgo));
   return d.toISOString();
}

async function uploadFile(
   bucket: string,
   path: string,
   buffer: Buffer,
   contentType: string,
) {
   const { error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, { contentType, upsert: true });
   if (error) throw new Error(`Upload failed (${bucket}/${path}): ${error.message}`);
   return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

const postFirstImageId = new Map<string, string>();

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
      is_private: profile.isPrivate,
      is_ai: true,
   });
   if (profileError) throw new Error(`Profile upsert: ${profileError.message}`);

   for (let pi = 0; pi < profile.posts.length; pi++) {
      const post = profile.posts[pi];
      const createdAt = randomPastDate(365);

      const { error: postError } = await supabase.from('posts').insert({
         id: post.id,
         user_id: profile.id,
         caption: post.caption,
         type: 'image',
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

            const altText = await generateAltText(imageUrl);
            await supabase
               .from('post_images')
               .update({ alt_text: altText })
               .eq('id', imageData.id);
         }),
      );
   }

   for (let si = 0; si < profile.stories.length; si++) {
      const story = profile.stories[si];
      const createdAt = randomPastDate(30);
      const expiresAt = new Date(
         new Date(createdAt).getTime() + 24 * 60 * 60 * 1000,
      ).toISOString();

      const { error: storyError } = await supabase.from('stories').insert({
         id: story.id,
         user_id: profile.id,
         is_ai: true,
         created_at: createdAt,
         expires_at: expiresAt,
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

   for (const highlight of profile.highlights) {
      const { error: hlError } = await supabase.from('story_highlights').insert({
         id: highlight.id,
         user_id: profile.id,
         title: highlight.title,
         is_ai: true,
      });
      if (hlError) throw new Error(`Highlight insert: ${hlError.message}`);

      for (let pos = 0; pos < highlight.storyIds.length; pos++) {
         await supabase.from('story_highlight_items').insert({
            story_id: highlight.storyIds[pos],
            highlight_id: highlight.id,
            position: pos,
         });
      }
   }

   console.log(`✓ ${profile.username}`);
}

async function insertBatch<T extends object>(table: string, rows: T[], batchSize = 500) {
   for (let i = 0; i < rows.length; i += batchSize) {
      const { error } = await supabase.from(table).insert(rows.slice(i, i + batchSize));
      if (error) console.error(`${table} batch error: ${error.message}`);
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
      data.graph.likes.map(l => ({
         post_id: l.postId,
         user_id: l.profileId,
         created_at: l.createdAt,
      })),
   );

   await insertBatch(
      'saves',
      data.graph.saves.map(s => ({
         post_id: s.postId,
         user_id: s.profileId,
         created_at: s.createdAt,
      })),
   );

   await insertBatch(
      'reposts',
      data.graph.reposts.map(r => ({
         post_id: r.postId,
         user_id: r.profileId,
         created_at: r.createdAt,
      })),
   );

   await insertBatch(
      'comments',
      data.graph.comments.map(c => ({
         id: c.id,
         post_id: c.postId,
         user_id: c.authorProfileId,
         content: c.text,
         is_ai: true,
         created_at: c.createdAt,
      })),
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
   for (const c of data.graph.comments) commentCounts.set(c.postId, (commentCounts.get(c.postId) ?? 0) + 1);
   for (const r of data.graph.reposts) repostCounts.set(r.postId, (repostCounts.get(r.postId) ?? 0) + 1);

   const postIds = data.profiles.flatMap(p => p.posts.map(post => post.id));
   await Promise.all(
      postIds.map(postId =>
         supabase.from('posts').update({
            like_count: likeCounts.get(postId) ?? 0,
            comment_count: commentCounts.get(postId) ?? 0,
            repost_count: repostCounts.get(postId) ?? 0,
         }).eq('id', postId),
      ),
   );

   console.log('✓ Seeding complete!');
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
