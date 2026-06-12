'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import { getThumbnailUrl } from '@/src/components/StoryCard';
import { styles } from './index.stylex';

interface CoverStepProps {
   stories: ArchivedStory[];
   coverId: string | null;
   onCoverSelect: (id: string) => void;
}

export default function CoverStep({ stories, coverId, onCoverSelect }: CoverStepProps) {
   const effectiveCoverId = coverId ?? stories[0]?.id ?? null;
   const coverStory = stories.find(s => s.id === effectiveCoverId) ?? stories[0] ?? null;
   const coverUrl = coverStory ? getThumbnailUrl(coverStory) : null;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.preview)}>
            {coverUrl && (
               <Image src={coverUrl} alt="" fill unoptimized style={{ objectFit: 'cover' }} />
            )}
         </div>
         <div {...stylex.props(styles.strip)}>
            {stories.map(story => (
               <button
                  key={story.id}
                  type="button"
                  {...stylex.props(
                     styles.thumb,
                     story.id === effectiveCoverId && styles.thumbSelected,
                  )}
                  onClick={() => onCoverSelect(story.id)}
               >
                  <Image
                     src={getThumbnailUrl(story)}
                     alt=""
                     fill
                     unoptimized
                     style={{ objectFit: 'cover' }}
                  />
               </button>
            ))}
         </div>
      </div>
   );
}
