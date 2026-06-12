'use client';

import * as stylex from '@stylexjs/stylex';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import ArchivedStoryCard from '@/src/components/ArchivedStoryCard';
import { styles } from './index.stylex';

interface SelectStoriesStepProps {
   stories: ArchivedStory[] | null;
   selectedIds: Set<string>;
   onToggle: (id: string) => void;
}

export default function SelectStoriesStep({
   stories,
   selectedIds,
   onToggle,
}: SelectStoriesStepProps) {
   if (stories === null) {
      return <div {...stylex.props(styles.centered)}>Loading...</div>;
   }

   if (stories.length === 0) {
      return <div {...stylex.props(styles.centered)}>No stories in your archive yet.</div>;
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.grid)}>
            {stories.map(story => (
               <ArchivedStoryCard
                  key={story.id}
                  story={story}
                  selected={selectedIds.has(story.id)}
                  onSelect={() => onToggle(story.id)}
               />
            ))}
         </div>
      </div>
   );
}
