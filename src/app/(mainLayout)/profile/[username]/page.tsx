import ProfilePage from '../../../../pageComponents/Profile';
import { loadProfilePage } from './loadProfilePage';

interface ProfilePageProps {
   params: Promise<{
      username: string;
   }>;
}

export default async function Profile({ params }: ProfilePageProps) {
   const { username } = await params;
   const profileData = await loadProfilePage(username);

   return (
      <ProfilePage
         userProfile={profileData.userProfile}
         posts={profileData.posts}
         followStatus={profileData.followStatus}
         isOwnProfile={profileData.isOwnProfile}
         note={profileData.note}
      />
   );
}
