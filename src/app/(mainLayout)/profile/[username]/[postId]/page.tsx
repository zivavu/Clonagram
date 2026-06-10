import { getPostAction } from '../../../../../actions/post/getPost';
import ProfilePage from '../../../../../pageComponents/Profile';
import { loadProfilePage } from '../loadProfilePage';

interface ProfilePostPageProps {
   params: Promise<{
      username: string;
      postId: string;
   }>;
}

export default async function ProfilePostPage({ params }: ProfilePostPageProps) {
   const { username, postId } = await params;

   const [profileData, post] = await Promise.all([
      loadProfilePage(username),
      getPostAction(postId),
   ]);

   return (
      <ProfilePage
         userProfile={profileData.userProfile}
         posts={profileData.posts}
         followStatus={profileData.followStatus}
         isOwnProfile={profileData.isOwnProfile}
         note={profileData.note}
         initialPost={post}
      />
   );
}
