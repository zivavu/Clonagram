import { getUserNote } from '@/src/actions/notes/getUserNote';
import { getUserProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import { getRingState } from '@/src/actions/story/getRingState';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';

export async function loadProfilePage(username: string) {
   const [authProfile, { userProfile, posts, followStatus }] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
   ]);

   const isOwnProfile = authProfile?.username === username;
   const [note, ringState] = await Promise.all([
      getUserNote(userProfile.id),
      getRingState(userProfile.id),
   ]);

   return { userProfile, posts, followStatus, isOwnProfile, note, ringState };
}
