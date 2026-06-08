import { getUserNote } from '../../../actions/notes/getUserNote';
import { getUserProfileWithPosts } from '../../../actions/profile/getUserProfileWithPosts';
import { getAuthProfile } from '../../../lib/supabase/getAuthProfile';
import ProfilePage from '../../../pageComponents/Profile';

export default async function Profile() {
   const profile = await getAuthProfile();

   if (!profile) throw new Error('Profile not found');

   const [{ userProfile, posts, followStatus }, note] = await Promise.all([
      getUserProfileWithPosts({ username: profile.username }),
      getUserNote(profile.id),
   ]);

   return (
      <ProfilePage
         userProfile={userProfile}
         posts={posts}
         followStatus={followStatus}
         isOwnProfile
         note={note}
      />
   );
}
