import { getUserNote } from '../../../actions/notes/getUserNote';
import { getUserProfileWithPosts } from '../../../actions/profile/getUserProfileWithPosts';
import { getSavedPosts } from '../../../actions/saves/getSavedPosts';
import { getRingState } from '../../../actions/story/getRingState';
import { getUserHighlights } from '../../../actions/story/getUserHighlights';
import { getAuthProfile } from '../../../lib/supabase/getAuthProfile';
import ProfilePage from '../../../pageComponents/Profile';

export default async function Profile() {
   const profile = await getAuthProfile();

   if (!profile) throw new Error('Profile not found');

   const [{ userProfile, posts, followStatus }, note, savedPosts] = await Promise.all([
      getUserProfileWithPosts({ username: profile.username }),
      getUserNote(profile.id),
      getSavedPosts(),
   ]);

   const [ringState, highlights] = await Promise.all([
      getRingState(userProfile.id),
      getUserHighlights(userProfile.id),
   ]);

   return (
      <ProfilePage
         userProfile={userProfile}
         posts={posts}
         followStatus={followStatus}
         isOwnProfile
         note={note}
         savedPosts={savedPosts}
         ringState={ringState}
         highlights={highlights}
      />
   );
}
