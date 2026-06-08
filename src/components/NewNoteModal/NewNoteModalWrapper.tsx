import { getNotesForFeed } from '@/src/actions/notes/getNotesForFeed';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import NewNoteModal from './index';

export default async function NewNoteModalWrapper() {
   const supabase = await createServerClient();
   const [profile, { ownNote }] = await Promise.all([getAuthProfile(supabase), getNotesForFeed()]);

   if (!profile) return null;

   return <NewNoteModal currentUser={profile} ownNote={ownNote} />;
}
