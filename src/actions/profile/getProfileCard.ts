'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { UserIdSchema, validate } from '@/src/lib/validation';
import type { UserProfileCard } from '@/src/queries/userProfiles';

export async function getProfileCard(params: { userId: string }) {
   const { userId } = validate(UserIdSchema, params);
   const supabase = await createServerClient();
   const { data, error } = await supabase
      .from('profiles')
      .select(
         `id, username, full_name, avatar_url, is_private,
         followers:follows!following_id(count),
         following:follows!follower_id(count),
         posts!posts_user_id_fkey(count)`,
      )
      .eq('id', userId)
      .single();

   throwIfError({ error }, 'Failed to fetch profile card');
   return data as UserProfileCard | null;
}

export async function getUserRecentPosts(userId: string, hideAi = false) {
   const supabase = await createServerClient();
   let query = supabase
      .from('posts')
      .select(
         'id, images:post_images(url, position), videos:post_videos(mux_playback_id, position)',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

   if (hideAi) query = query.eq('is_ai', false);

   const { data, error } = await query;

   throwIfError({ error }, 'Failed to fetch recent posts');
   return data ?? [];
}
