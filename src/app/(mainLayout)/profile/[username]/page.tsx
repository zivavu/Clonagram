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

   const [authProfile, { userProfile, posts }] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
   ]);

   const isOwnProfile = authProfile?.username === username;

   return <ProfilePage userProfile={userProfile} posts={posts} isOwnProfile={isOwnProfile} />;
}
