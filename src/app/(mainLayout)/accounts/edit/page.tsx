import { redirect } from 'next/navigation';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import EditProfile from '@/src/pageComponents/EditProfile';

export default async function EditProfilePage() {
   const profile = await getAuthProfile();
   if (!profile) redirect('/login');
   return <EditProfile profile={profile} />;
}
