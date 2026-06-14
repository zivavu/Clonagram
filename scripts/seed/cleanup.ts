import { supabase } from './lib/supabaseAdmin';

async function main() {
   console.log('Fetching AI profile IDs...');
   const { data: aiProfiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_ai', true);

   if (error) throw new Error(error.message);
   const ids = (aiProfiles ?? []).map(p => p.id);
   console.log(`Found ${ids.length} AI profiles.`);

   console.log('Deleting AI content...');
   await supabase.from('comments').delete().eq('is_ai', true);
   await supabase.from('story_highlights').delete().eq('is_ai', true);
   await supabase.from('stories').delete().eq('is_ai', true);
   await supabase.from('posts').delete().eq('is_ai', true);
   await supabase.from('profiles').delete().eq('is_ai', true);

   console.log('Deleting auth users...');
   for (const id of ids) {
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) console.error(`  Failed to delete ${id}: ${authError.message}`);
   }

   console.log(`✓ Cleanup complete. Deleted ${ids.length} AI profiles.`);
   console.log('  Note: storage files in avatars/, posts/, stories/ buckets are not auto-deleted.');
   console.log('  Clean them up via the Supabase dashboard Storage tab if needed.');
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
