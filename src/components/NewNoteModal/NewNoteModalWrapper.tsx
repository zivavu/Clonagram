import { getNotesForFeed } from '@/src/actions/notes/getNotesForFeed';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import NewNoteModal from './index';

export default async function NewNoteModalWrapper() {
   const [profile, { ownNote, ownNoteId }] = await Promise.all([
      getAuthProfile(),
      getNotesForFeed(),
   ]);

   if (!profile) return null;

   return <NewNoteModal currentUser={profile} ownNote={ownNote} ownNoteId={ownNoteId} />;
}
