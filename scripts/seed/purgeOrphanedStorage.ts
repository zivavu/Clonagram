import { supabase } from './lib/supabaseAdmin';

const BUCKETS = ['avatars', 'posts', 'stories'] as const;

async function listTopLevelFolders(bucket: string): Promise<string[]> {
   const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });
   if (error) throw new Error(`list ${bucket}: ${error.message}`);
   return (data ?? []).map(o => o.name);
}

async function deleteFolder(bucket: string, prefix: string) {
   const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
   if (error || !data?.length) return;
   const paths = data.map(o => `${prefix}/${o.name}`);
   await supabase.storage.from(bucket).remove(paths);
}

async function main() {
   const { data: profiles, error } = await supabase.from('profiles').select('id');
   if (error) throw new Error(error.message);
   const existingIds = new Set((profiles ?? []).map(p => p.id));

   let totalDeleted = 0;

   for (const bucket of BUCKETS) {
      const folders = await listTopLevelFolders(bucket);
      const orphans = folders.filter(f => !existingIds.has(f));
      console.log(`${bucket}: ${folders.length} folders, ${orphans.length} orphaned`);

      for (const prefix of orphans) {
         await deleteFolder(bucket, prefix);
         console.log(`  deleted ${bucket}/${prefix}`);
         totalDeleted++;
      }
   }

   console.log(`\n✓ Purged ${totalDeleted} orphaned storage folders.`);
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
