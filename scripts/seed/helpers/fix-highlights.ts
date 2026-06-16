import { readFileSync } from 'fs';
import { supabase } from '../lib/supabaseAdmin';
import type { SeedData } from '../types';
import { PROFILES_JSON } from './config';

async function main() {
   const data: SeedData = JSON.parse(readFileSync(PROFILES_JSON, 'utf-8'));

   for (const profile of data.profiles) {
      const storyIds = profile.stories.map(s => s.id);
      const { data: dbStories } = await supabase
         .from('story_images')
         .select('story_id')
         .in('story_id', storyIds);
      const storiesWithMedia = new Set(dbStories?.map(s => s.story_id) ?? []);

      const seenTitles = new Set<string>();
      const uniqueHighlights = profile.highlights.filter(h => {
         const key = h.title.toLowerCase();
         if (seenTitles.has(key)) return false;
         seenTitles.add(key);
         return true;
      });

      const storyPool = [...storiesWithMedia].sort(() => Math.random() - 0.5);
      const chunkSize = Math.max(
         2,
         Math.floor(storyPool.length / Math.max(1, uniqueHighlights.length)),
      );
      const highlightsWithStories = uniqueHighlights
         .map((h, i) => ({ ...h, storyIds: storyPool.slice(i * chunkSize, (i + 1) * chunkSize) }))
         .filter(h => h.storyIds.length >= 2);

      const { error: deleteError } = await supabase
         .from('story_highlights')
         .delete()
         .eq('user_id', profile.id);
      if (deleteError) throw new Error(`Delete highlights: ${deleteError.message}`);

      for (const highlight of highlightsWithStories) {
         const { error: hlError } = await supabase.from('story_highlights').insert({
            id: highlight.id,
            user_id: profile.id,
            title: highlight.title,
            is_ai: true,
         });
         if (hlError) throw new Error(`Highlight insert: ${hlError.message}`);

         const items = highlight.storyIds.map((storyId, pos) => ({
            story_id: storyId,
            highlight_id: highlight.id,
            position: pos,
         }));
         const { error: itemError } = await supabase.from('story_highlight_items').insert(items);
         if (itemError) throw new Error(`story_highlight_items insert: ${itemError.message}`);
      }

      console.log(`✓ @${profile.username} — ${highlightsWithStories.length} highlights`);
   }

   console.log('\n✓ Done');
}

main().catch(err => {
   console.error(err);
   process.exit(1);
});
