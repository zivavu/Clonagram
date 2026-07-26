import * as stylex from '@stylexjs/stylex';
import type { StoryEntry } from '@/src/actions/story/getActiveStories';
import UserAvatar from '@/src/components/UserAvatar';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from '../../index.stylex';

interface SideStoryOverlayProps {
   story: StoryEntry;
}

export default function SideStoryOverlay({ story }: SideStoryOverlayProps) {
   return (
      <div {...stylex.props(styles.sideStoryOverlay)}>
         <UserAvatar
            src={story.avatarUrl}
            alt={story.username}
            username={story.username}
            size={64}
            useHoverCard={false}
            showStoryRing={false}
            disableLink
            {...stylex.props(styles.avatarImage)}
         />
         <span {...stylex.props(styles.sideStoryUsername)}>{story.username}</span>
         <span {...stylex.props(styles.sideStoryTimestamp)}>
            {formatRelativeTimeShortUnit(story.timestamp)}
         </span>
      </div>
   );
}
