import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import type { StoryEntry } from '@/src/actions/story/getActiveStories';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from '../../index.stylex';

interface SideStoryOverlayProps {
   story: StoryEntry;
}

export default function SideStoryOverlay({ story }: SideStoryOverlayProps) {
   return (
      <div {...stylex.props(styles.sideStoryOverlay)}>
         <Image
            src={story.avatarUrl}
            alt={story.username}
            width={64}
            height={64}
            {...stylex.props(styles.avatarImage)}
         />
         <span {...stylex.props(styles.sideStoryUsername)}>{story.username}</span>
         <span {...stylex.props(styles.sideStoryTimestamp)}>
            {formatRelativeTimeShortUnit(story.timestamp)}
         </span>
      </div>
   );
}
