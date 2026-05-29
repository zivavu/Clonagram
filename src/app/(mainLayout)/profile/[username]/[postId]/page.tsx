import { getPostAction } from '../../../../../actions/post/getPost';
import { getUserProfileWithPosts } from '../../../../../actions/profile/getUserProfileWithPosts';
import { getAuthProfile } from '../../../../../lib/supabase/getAuthProfile';
import ProfilePage from '../../../../../pageComponents/Profile';

interface ProfilePostPageProps {
   params: Promise<{
      username: string;
      postId: string;
   }>;
}

export default async function ProfilePostPage({ params }: ProfilePostPageProps) {
   const { username, postId } = await params;

   const [authProfile, { userProfile, posts }, post] = await Promise.all([
      getAuthProfile(),
      getUserProfileWithPosts({ username }),
      getPostAction(postId),
   ]);

   const isOwnProfile = authProfile?.username === username;

   return (
      <ProfilePage
         userProfile={userProfile}
         posts={posts}
         isOwnProfile={isOwnProfile}
         initialPost={post}
      />
   );
}
