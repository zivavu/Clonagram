'use server';

import type { PostData } from '../components/CreatePostModal/types';
import { createServerClient } from '../lib/supabase/server';

export async function createPost(postData: PostData) {
   const { media, caption, location, collaborators, postSettings } = postData;

   const supabaseClient = createServerClient();
}
