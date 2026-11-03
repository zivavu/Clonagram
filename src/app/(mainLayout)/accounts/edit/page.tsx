import { redirect } from 'next/navigation';
import { isDemoAccount } from '@/src/lib/demoAccounts';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { getCachedUser } from '@/src/lib/supabase/getCachedUser';
import EditProfile from '@/src/pageComponents/EditProfile';

export default async function EditProfilePage() {
   const [profile, user] = await Promise.all([getAuthProfile(), getCachedUser()]);
   if (!profile) redirect('/login');

   return <EditProfile profile={profile} isDemoAccount={isDemoAccount(user)} />;
}
