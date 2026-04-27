import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from '../styles';
import { Layout, StoryEntry } from '../types';
import ActiveStoryOverlay from './ActiveStoryOverlay';
import SideStoryOverlay from './SideStoryOverlay';

interface StoryCardProps {
   story: StoryEntry;
   isCurrent: boolean;
   layout: Layout;
   currentStoryIndex: number;
   onClick: () => void;
   formatTimestamp: (timestamp: string) => string;
}

export default function StoryCard({
   story,
   isCurrent,
   layout,
   currentStoryIndex,
   onClick,
   formatTimestamp,
}: StoryCardProps) {
   return (
      <div
         {...stylex.props(styles.story, !layout.isMobile && styles.storyRounded)}
         style={{
            width: `${isCurrent ? layout.mainWidth : layout.sideWidth}px`,
            height: `${isCurrent ? layout.mainHeight : layout.sideHeight}px`,
         }}
         onClick={onClick}
      >
         {!isCurrent && <SideStoryOverlay story={story} formatTimestamp={formatTimestamp} />}
         {isCurrent && (
            <ActiveStoryOverlay story={story} currentStoryIndex={currentStoryIndex} formatTimestamp={formatTimestamp} />
         )}

         <Image
            src={story.stories[0].storyImageUrl}
            alt={story.username}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, 33vw"
         />
      </div>
   );
}
