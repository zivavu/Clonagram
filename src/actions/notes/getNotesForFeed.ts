'use server';
import 'server-only';

import { throwIfError } from '../../lib/unwrap';
import { getOptionalUser } from '../getAuthUser';

export type NoteEntry = {
   userId: string;
   username: string;
   avatarUrl: string;
   content: string;
};

export async function getNotesForFeed(): Promise<{
   notes: NoteEntry[];
   ownNote: string | null;
   ownNoteId: string | null;
}> {
   const { supabase, user } = await getOptionalUser();

   if (!user) return { notes: [], ownNote: null, ownNoteId: null };

   const { data, error } = await supabase
      .from('notes')
      .select('id, user_id, content, profiles!notes_user_id_fkey(username, avatar_url)');

   throwIfError({ error }, 'Failed to fetch notes');

   let ownNote: string | null = null;
   let ownNoteId: string | null = null;
   const notes: NoteEntry[] = [];

   for (const row of data ?? []) {
      const profile = row.profiles as { username: string; avatar_url: string | null } | null;
      if (!profile) continue;

      if (row.user_id === user.id) {
         ownNote = row.content;
         ownNoteId = row.id;
         continue;
      }

      notes.push({
         userId: row.user_id,
         username: profile.username,
         avatarUrl: profile.avatar_url ?? '',
         content: row.content,
      });
   }

   return { notes, ownNote, ownNoteId };
}
