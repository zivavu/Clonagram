import { getUserNote } from '@/src/actions/notes/getUserNote';
import { getUserProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';

export async function loadProfilePage(username: string) {
   const [authProfile, { userProfile, posts, followStatus }] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
   ]);

   const isOwnProfile = authProfile?.username === username;
   const note = await getUserNote(userProfile.id);

   return { userProfile, posts, followStatus, isOwnProfile, note };
}
