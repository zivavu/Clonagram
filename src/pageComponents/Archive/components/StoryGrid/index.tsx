import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import type { MonthGroup } from '../../types';
import DateBadge from '../DateBadge';
import { styles } from './index.stylex';

function getThumbnailUrl(story: ArchivedStory) {
   if (story.type === 'image') return story.url;
   return `https://image.mux.com/${story.url}/thumbnail.jpg`;
}

export default function StoryGrid({ groups }: { groups: MonthGroup[] }) {
   return (
      <>
         {groups.map(group => (
            <div key={group.label} {...stylex.props(styles.group)}>
               <h3 {...stylex.props(styles.monthLabel)}>{group.label}</h3>
               <div {...stylex.props(styles.grid)}>
                  {group.stories.map(story => (
                     <Link
                        key={story.id}
                        href={`/stories/archive/${story.id}`}
                        {...stylex.props(styles.thumbnail)}
                     >
                        <DateBadge isoDate={story.createdAt} />
                        {story.type === 'image' && story.blurDataUrl ? (
                           <Image
                              src={getThumbnailUrl(story)}
                              alt=""
                              fill
                              unoptimized
                              placeholder="blur"
                              blurDataURL={story.blurDataUrl}
                              style={{ objectFit: 'cover' }}
                           />
                        ) : (
                           <Image
                              src={getThumbnailUrl(story)}
                              alt=""
                              fill
                              unoptimized
                              style={{ objectFit: 'cover' }}
                           />
                        )}
                     </Link>
                  ))}
               </div>
            </div>
         ))}
      </>
   );
}
