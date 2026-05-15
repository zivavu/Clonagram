'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import type { CreatePostParams } from '../components/CreatePostModal/types';
import { createServerClient } from '../lib/supabase/server';

function extractHashtags(caption: string | null): string[] {
   if (!caption) return [];
   const matches = caption.match(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/g);
   if (!matches) return [];
   return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];
}

export async function createPost(params: CreatePostParams): Promise<void> {
   const supabase = await createServerClient();

   const { data: userData, error: userError } = await supabase.auth.getUser();
   if (userError || !userData.user) {
      throw new Error('Unauthorized');
   }

   const userId = userData.user.id;
   const hasVideo = params.mediaResults.some(media => media.type === 'video');

   const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
         user_id: userId,
         caption: params.caption,
         type: hasVideo ? 'reel' : 'photo',
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

   if (postError || !post) {
      throw new Error(`Failed to create post: ${postError?.message ?? 'unknown error'}`);
   }

   const postId = post.id;
   const imageInserts = [];
   const videoInserts = [];

   for (let i = 0; i < params.mediaResults.length; i++) {
      const result = params.mediaResults[i];
      if (result.type === 'image') {
         imageInserts.push({ post_id: postId, position: i, url: result.path });
      } else {
         videoInserts.push({
            post_id: postId,
            position: i,
            mux_asset_id: result.assetId,
            mux_playback_id: result.playbackId,
            mux_status: 'ready',
            duration: result.duration,
         });
      }
   }

   if (imageInserts.length > 0) {
      const { error: imagesError } = await supabase.from('post_images').insert(imageInserts);
      if (imagesError) {
         throw new Error(`Failed to insert images: ${imagesError.message}`);
      }
   }

   if (videoInserts.length > 0) {
      const { error: videosError } = await supabase.from('post_videos').insert(videoInserts);
      if (videosError) {
         throw new Error(`Failed to insert videos: ${videosError.message}`);
      }
   }

   if (params.collaborators.length > 0) {
      const collaboratorInserts = params.collaborators.map(c => ({
         post_id: postId,
         user_id: c.id,
      }));
      const { error: collabError } = await supabase
         .from('post_collaborators')
         .insert(collaboratorInserts);
      if (collabError) {
         throw new Error(`Failed to insert collaborators: ${collabError.message}`);
      }
   }

   const hashtags = extractHashtags(params.caption);
   if (hashtags.length > 0) {
      const { data: existingHashtags, error: hashError } = await supabase
         .from('hashtags')
         .select('id, name')
         .in('name', hashtags);

      if (hashError) {
         throw new Error(`Failed to fetch hashtags: ${hashError.message}`);
      }

      const existingNames = new Set(existingHashtags?.map(h => h.name) ?? []);
      const newHashtags = hashtags.filter(name => !existingNames.has(name)).map(name => ({ name }));

      let allHashtagIds = existingHashtags?.map(h => h.id) ?? [];

      if (newHashtags.length > 0) {
         const { data: inserted, error: insertHashError } = await supabase
            .from('hashtags')
            .insert(newHashtags)
            .select('id');

         if (insertHashError || !inserted) {
            throw new Error(
               `Failed to insert hashtags: ${insertHashError?.message ?? 'unknown error'}`,
            );
         }

         allHashtagIds = [...allHashtagIds, ...inserted.map(h => h.id)];
      }

      if (allHashtagIds.length > 0) {
         const postHashtagInserts = allHashtagIds.map(hashtagId => ({
            post_id: postId,
            hashtag_id: hashtagId,
         }));
         const { error: phError } = await supabase.from('post_hashtags').insert(postHashtagInserts);
         if (phError) {
            throw new Error(`Failed to link hashtags: ${phError.message}`);
         }
      }
   }
   revalidatePath('/');
}
