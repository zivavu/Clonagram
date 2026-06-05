'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import type { MonthGroup } from '../../types';
import StoryViewer from '../StoryViewer';
import { styles } from './index.stylex';

function getThumbnailUrl(story: ArchivedStory) {
   if (story.type === 'image') return story.url;
   return `https://image.mux.com/${story.url}/thumbnail.jpg`;
}

interface StoryGridProps {
   groups: MonthGroup[];
}

export default function StoryGrid({ groups }: StoryGridProps) {
   const allStories = groups.flatMap(g => g.stories);
   const storyIndexMap = new Map(allStories.map((s, i) => [s.id, i]));
   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

   return (
      <>
         {groups.map(group => (
            <div key={group.label} {...stylex.props(styles.group)}>
               <h3 {...stylex.props(styles.monthLabel)}>{group.label}</h3>
               <div {...stylex.props(styles.grid)}>
                  {group.stories.map(story => {
                     const index = storyIndexMap.get(story.id) ?? 0;
                     const thumbUrl = getThumbnailUrl(story);
                     return (
                        <button
                           key={story.id}
                           type="button"
                           {...stylex.props(styles.thumbnail)}
                           onClick={() => setSelectedIndex(index)}
                        >
                           {story.type === 'image' && story.blurDataUrl ? (
                              <Image
                                 src={thumbUrl}
                                 alt=""
                                 fill
                                 unoptimized
                                 placeholder="blur"
                                 blurDataURL={story.blurDataUrl}
                                 style={{ objectFit: 'cover' }}
                              />
                           ) : (
                              <Image
                                 src={thumbUrl}
                                 alt=""
                                 fill
                                 unoptimized
                                 style={{ objectFit: 'cover' }}
                              />
                           )}
                        </button>
                     );
                  })}
               </div>
            </div>
         ))}
         {selectedIndex !== null && (
            <StoryViewer
               stories={allStories}
               initialIndex={selectedIndex}
               onClose={() => setSelectedIndex(null)}
            />
         )}
      </>
   );
}
