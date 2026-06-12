import * as stylex from '@stylexjs/stylex';
import ArchivedStoryCard from '@/src/components/ArchivedStoryCard';
import type { MonthGroup } from '../../types';
import { styles } from './index.stylex';

export default function StoryGrid({ groups }: { groups: MonthGroup[] }) {
   return (
      <>
         {groups.map(group => (
            <div key={group.label} {...stylex.props(styles.group)}>
               <div {...stylex.props(styles.grid)}>
                  {group.stories.map(story => (
                     <ArchivedStoryCard
                        key={story.id}
                        story={story}
                        href={`/stories/archive/${story.id}`}
                     />
                  ))}
               </div>
            </div>
         ))}
      </>
   );
}
