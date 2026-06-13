import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import ProfilePage from '@/src/pageComponents/Profile';
import { loadProfilePage } from './[username]/loadProfilePage';

export default async function Profile() {
   const profile = await getAuthProfile();

   if (!profile) throw new Error('Profile not found');

   const result = await loadProfilePage(profile.username, { includeSaved: true });

   return <ProfilePage {...result} isOwnProfile />;
}
