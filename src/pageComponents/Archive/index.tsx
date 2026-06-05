import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { MdChevronLeft, MdHistory } from 'react-icons/md';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import EmptyState from './components/EmptyState';
import StoryGrid from './components/StoryGrid';
import { styles } from './index.stylex';
import type { MonthGroup } from './types';

function groupStoriesByMonth(stories: ArchivedStory[]): MonthGroup[] {
   const groups = new Map<string, ArchivedStory[]>();
   for (const story of stories) {
      const date = new Date(story.createdAt);
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const group = groups.get(label) ?? [];
      group.push(story);
      groups.set(label, group);
   }
   return Array.from(groups.entries()).map(([label, items]) => ({ label, stories: items }));
}

export default function ArchivePage({ stories }: { stories: ArchivedStory[] }) {
   const groups = groupStoriesByMonth(stories);

   return (
      <div {...stylex.props(styles.page)}>
         <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.header)}>
               <Link href="/profile" {...stylex.props(styles.backLink)}>
                  <MdChevronLeft size={24} />
                  Archive
               </Link>
            </div>
            <div {...stylex.props(styles.tabBar)}>
               <div {...stylex.props(styles.tab)}>
                  <MdHistory size={14} />
                  <span {...stylex.props(styles.tabText)}>STORIES</span>
               </div>
            </div>
            <div {...stylex.props(styles.separator)} />
            {stories.length === 0 ? <EmptyState /> : <StoryGrid groups={groups} />}
         </div>
      </div>
   );
}
