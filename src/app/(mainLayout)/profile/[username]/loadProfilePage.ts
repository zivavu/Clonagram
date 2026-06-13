import { getUserNote } from '@/src/actions/notes/getUserNote';
import { getRepostedPosts } from '@/src/actions/post/getRepostedPosts';
import { getSavedPosts } from '@/src/actions/post/saves/getSavedPosts';
import { getUserProfileWithPosts } from '@/src/actions/profile/getUserProfileWithPosts';
import { getRingState } from '@/src/actions/story/getRingState';
import { getUserHighlights } from '@/src/actions/story/getUserHighlights';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';

export async function loadProfilePage(username: string, options?: { includeSaved?: boolean }) {
   const [authProfile, { userProfile, posts, followStatus }] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
   ]);

   const isOwnProfile = authProfile?.username === username;

   const notePromise = getUserNote({ userId: userProfile.id });
   const ringStatePromise = getRingState({ targetUserId: userProfile.id });
   const highlightsPromise = getUserHighlights({ userId: userProfile.id });
   const repostedPostsPromise = getRepostedPosts({ userId: userProfile.id });

   if (options?.includeSaved) {
      const [note, ringState, highlights, savedPosts, repostedPosts] = await Promise.all([
         notePromise,
         ringStatePromise,
         highlightsPromise,
         getSavedPosts(),
         repostedPostsPromise,
      ]);
      return {
         userProfile,
         posts,
         followStatus,
         isOwnProfile,
         note,
         ringState,
         highlights,
         savedPosts,
         repostedPosts,
      };
   }

   const [note, ringState, highlights, repostedPosts] = await Promise.all([
      notePromise,
      ringStatePromise,
      highlightsPromise,
      repostedPostsPromise,
   ]);
   return { userProfile, posts, followStatus, isOwnProfile, note, ringState, highlights, repostedPosts };
}
