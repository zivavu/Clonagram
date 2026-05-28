import { getUserProfileWithPosts } from '../../../actions/profile/getUserProfileWithPosts';
import { getAuthProfile } from '../../../lib/supabase/getAuthProfile';
import ProfilePage from '../../../pageComponents/Profile';

export default async function Profile() {
   const profile = await getAuthProfile();

   if (!profile) throw new Error('Profile not found');

   const { userProfile, posts } = await getUserProfileWithPosts({ username: profile?.username });

   return <ProfilePage userProfile={userProfile} posts={posts} />;
}
