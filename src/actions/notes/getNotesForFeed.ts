'use server';
import 'server-only';

import { createServerClient } from '../../lib/supabase/server';

export type NoteEntry = {
   userId: string;
   username: string;
   avatarUrl: string;
   content: string;
};

export async function getNotesForFeed(): Promise<{
   notes: NoteEntry[];
   ownNote: string | null;
}> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) return { notes: [], ownNote: null };

   const { data, error } = await supabase
      .from('notes')
      .select('user_id, content, profiles!notes_user_id_fkey(username, avatar_url)');

   if (error) throw new Error(`Failed to fetch notes: ${error.message}`);

   let ownNote: string | null = null;
   const notes: NoteEntry[] = [];

   for (const row of data ?? []) {
      const profile = row.profiles as { username: string; avatar_url: string | null } | null;
      if (!profile) continue;

      if (row.user_id === user.id) {
         ownNote = row.content;
         continue;
      }

      notes.push({
         userId: row.user_id,
         username: profile.username,
         avatarUrl: profile.avatar_url ?? '',
         content: row.content,
      });
   }

   return { notes, ownNote };
}
