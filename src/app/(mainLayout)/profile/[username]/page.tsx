import { getUserNote } from '../../../../actions/notes/getUserNote';
import { getUserProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import { getAuthProfile } from '../../../../lib/supabase/getAuthProfile';
import ProfilePage from '../../../../pageComponents/Profile';

interface ProfilePageProps {
   params: Promise<{
      username: string;
   }>;
}

export default async function Profile({ params }: ProfilePageProps) {
   const { username } = await params;

   const [authProfile, { userProfile, posts, followStatus }] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
   ]);

   const isOwnProfile = authProfile?.username === username;
   const note = await getUserNote(userProfile.id);

   return (
      <ProfilePage
         userProfile={userProfile}
         posts={posts}
         followStatus={followStatus}
         isOwnProfile={isOwnProfile}
         note={note}
      />
   );
}
