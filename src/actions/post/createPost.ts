'use server';
import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { throwIfError } from '@/src/lib/unwrap';
import type { Database } from '@/src/types/database';
import type { CreatePostParams, TaggedPerson } from '../../components/CreatePostModal/types';
import { generateImageAltText } from '../ai/generateImageAltText';
import { getAuthUser } from '../getAuthUser';

function extractHashtags(caption: string | null) {
   if (!caption) return [];
   const matches = caption.match(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/g);
   if (!matches) return [];
   return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];
}

async function saveMedia(
   supabase: SupabaseClient<Database>,
   postId: string,
   mediaResults: CreatePostParams['mediaResults'],
) {
   const imageInserts: Array<{
      post_id: string;
      position: number;
      url: string;
      width: number;
      height: number;
      blur_data_url: string | null;
      alt_text: string | null;
   }> = [];
   const imageTags: Array<{ positionIndex: number; tags: TaggedPerson[] }> = [];
   const videoInserts: Array<{
      post_id: string;
      position: number;
      mux_asset_id: string;
      mux_playback_id: string;
      mux_status: string;
      duration: number;
      width: number;
      height: number;
   }> = [];

   for (let i = 0; i < mediaResults.length; i++) {
      const result = mediaResults[i];
      if (result.type === 'image') {
         imageInserts.push({
            post_id: postId,
            position: i,
            url: result.path,
            width: result.width,
            height: result.height,
            blur_data_url: result.blurDataURL ?? null,
            alt_text: result.alt ?? null,
         });
         if (result.tags.length > 0) {
            imageTags.push({ positionIndex: imageInserts.length - 1, tags: result.tags });
         }
      } else {
         videoInserts.push({
            post_id: postId,
            position: i,
            mux_asset_id: result.assetId,
            mux_playback_id: result.playbackId,
            mux_status: 'ready',
            duration: result.duration,
            width: result.width,
            height: result.height,
         });
      }
   }

   let insertedImageIds: { id: string; url: string }[] = [];

   if (imageInserts.length > 0) {
      const { data: insertedImages, error } = await supabase
         .from('post_images')
         .insert(imageInserts)
         .select('id, url');
      throwIfError({ error }, 'Failed to insert images');
      if (!insertedImages) throw new Error('Failed to insert images: no data returned');

      insertedImageIds = insertedImages;

      if (imageTags.length > 0) {
         await saveImageTags(supabase, insertedImages, imageTags);
      }
   }

   if (videoInserts.length > 0) {
      const { error } = await supabase.from('post_videos').insert(videoInserts);
      throwIfError({ error }, 'Failed to insert videos');
   }

   return insertedImageIds;
}

async function saveImageTags(
   supabase: SupabaseClient<Database>,
   insertedImages: { id: string }[],
   imageTags: Array<{ positionIndex: number; tags: TaggedPerson[] }>,
) {
   const tagInserts = imageTags.flatMap(({ positionIndex, tags }) => {
      const imageId = insertedImages[positionIndex]?.id;
      if (!imageId) return [];
      return tags.map(tag => ({ image_id: imageId, user_id: tag.user.id, x: tag.x, y: tag.y }));
   });

   if (tagInserts.length === 0) return;
   const { error } = await supabase.from('post_image_tags').insert(tagInserts);
   throwIfError({ error }, 'Failed to insert image tags');
}

async function saveCollaborators(
   supabase: SupabaseClient<Database>,
   postId: string,
   collaborators: CreatePostParams['collaborators'],
) {
   if (collaborators.length === 0) return;

   const inserts = collaborators.map(c => ({ post_id: postId, user_id: c.id }));
   const { error } = await supabase.from('post_collaborators').insert(inserts);
   throwIfError({ error }, 'Failed to insert collaborators');
}

async function saveHashtags(
   supabase: SupabaseClient<Database>,
   postId: string,
   caption: string | null,
) {
   const hashtags = extractHashtags(caption);
   if (hashtags.length === 0) return;

   const { data: existing, error: fetchError } = await supabase
      .from('hashtags')
      .select('id, name')
      .in('name', hashtags);

   throwIfError({ error: fetchError }, 'Failed to fetch hashtags');

   const existingNames = new Set(existing?.map(h => h.name) ?? []);
   const newHashtags = hashtags.filter(name => !existingNames.has(name)).map(name => ({ name }));

   let allHashtagIds = existing?.map(h => h.id) ?? [];

   if (newHashtags.length > 0) {
      const { data: inserted, error: insertError } = await supabase
         .from('hashtags')
         .insert(newHashtags)
         .select('id');

      throwIfError({ error: insertError }, 'Failed to insert hashtags');
      if (!inserted) throw new Error('Failed to insert hashtags: no data returned');

      allHashtagIds = [...allHashtagIds, ...inserted.map(h => h.id)];
   }

   if (allHashtagIds.length > 0) {
      const postHashtagInserts = allHashtagIds.map(hashtagId => ({
         post_id: postId,
         hashtag_id: hashtagId,
      }));
      const { error: linkError } = await supabase.from('post_hashtags').insert(postHashtagInserts);
      throwIfError({ error: linkError }, 'Failed to link hashtags');
   }
}

export async function createPost(params: CreatePostParams) {
   const { supabase, user } = await getAuthUser();
   const userId = user.id;
   const isReel =
      params.mediaResults.some(media => media.type === 'video') &&
      params.mediaResults.length === 1 &&
      params.aspectRatio === '9:16';

   const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
         user_id: userId,
         caption: params.caption,
         type: isReel ? 'reel' : 'photo',
         aspect_ratio: params.aspectRatio,
         location_name: params.location?.name ?? null,
         location_lat: params.location?.lat ?? null,
         location_lon: params.location?.lon ?? null,
         hide_likes: params.postSettings.hideLikes,
         comments_off: params.postSettings.commentsOff,
         share_to_clonedbook: params.postSettings.shareToClonedbook,
      })
      .select('id')
      .single();

   throwIfError({ error: postError }, 'Failed to create post');
   if (!post) throw new Error('Failed to create post: no data returned');

   const postId = post.id;

   const insertedImageIds = await saveMedia(supabase, postId, params.mediaResults);

   await Promise.all([
      saveCollaborators(supabase, postId, params.collaborators),
      saveHashtags(supabase, postId, params.caption),
   ]);

   await Promise.all(
      insertedImageIds
         .filter((img, i) => {
            const media = params.mediaResults[i];
            return media.type === 'image' && !media.alt && img.url;
         })
         .map(img => generateImageAltText({ imageId: img.id, imageUrl: img.url })),
   );
}
