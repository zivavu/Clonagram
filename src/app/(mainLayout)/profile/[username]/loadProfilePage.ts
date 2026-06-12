import { getUserNote } from '@/src/actions/notes/getUserNote';
import { getUserProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import { getRingState } from '@/src/actions/story/getRingState';
import { getUserHighlights } from '@/src/actions/story/getUserHighlights';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';

export async function loadProfilePage(username: string) {
   const [authProfile, { userProfile, posts, followStatus }] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
   ]);

   const isOwnProfile = authProfile?.username === username;
   const [note, ringState, highlights] = await Promise.all([
      getUserNote({ userId: userProfile.id }),
      getRingState({ targetUserId: userProfile.id }),
      getUserHighlights({ userId: userProfile.id }),
   ]);

   return { userProfile, posts, followStatus, isOwnProfile, note, ringState, highlights };
}
