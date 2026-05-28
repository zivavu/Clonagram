import { getUserProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import ProfilePage from '../../../../pageComponents/Profile';

interface ProfilePageProps {
   params: Promise<{
      username: string;
   }>;
}

export default async function Profile({ params }: ProfilePageProps) {
   const { username } = await params;

   const { userProfile, posts } = await getUserProfileWithPosts({ username });

   return <ProfilePage userProfile={userProfile} posts={posts} />;
}
