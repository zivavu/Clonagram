import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from '../styles';
import { StoryEntry } from '../types';

interface SideStoryOverlayProps {
   story: StoryEntry;
   formatTimestamp: (timestamp: string) => string;
}

export default function SideStoryOverlay({ story, formatTimestamp }: SideStoryOverlayProps) {
   return (
      <div {...stylex.props(styles.sideStoryOverlay)}>
         <Image
            src={story.avatarUrl}
            alt={story.username}
            width={64}
            height={64}
            loading="eager"
            style={{ borderRadius: '50%' }}
         />
         <span {...stylex.props(styles.sideStoryUsername)}>{story.username}</span>
         <span {...stylex.props(styles.sideStoryTimestamp)}>{formatTimestamp(story.timestamp)}</span>
      </div>
   );
}
