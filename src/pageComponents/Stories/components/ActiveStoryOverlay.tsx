import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from '../styles';
import { StoryEntry } from '../types';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';

interface ActiveStoryOverlayProps {
   story: StoryEntry;
   currentStoryIndex: number;
   formatTimestamp: (timestamp: string) => string;
}

export default function ActiveStoryOverlay({ story, currentStoryIndex, formatTimestamp }: ActiveStoryOverlayProps) {
   return (
      <div {...stylex.props(styles.activeStoryOverlay)}>
         <div {...stylex.props(styles.substoriesBarsContainer)}>
            {story.stories.map((_, j) => (
               <div
                  key={j}
                  {...stylex.props(styles.substoriesBarItem, j === currentStoryIndex && styles.substoriesBarItemActive)}
               />
            ))}
         </div>
         <div {...stylex.props(styles.activeStoryTopNavigation)}>
            <div {...stylex.props(styles.activeStoryTopNavigationLeft)}>
               <Image
                  src={story.avatarUrl}
                  alt={story.username}
                  width={32}
                  height={32}
                  loading="eager"
                  style={{ borderRadius: '50%' }}
               />
               <span {...stylex.props(styles.activeStoryUsername)}>{story.username}</span>
               <span {...stylex.props(styles.activeStoryTimestamp)}>{formatTimestamp(story.timestamp)}</span>
            </div>
            <div {...stylex.props(styles.activeStoryTopNavigationRight)}>
               <button {...stylex.props(styles.activeStoryTopNavigationRightButton)}>
                  <VolumeUpRounded style={{ fontSize: 20 }} />
               </button>
               <button {...stylex.props(styles.activeStoryTopNavigationRightButton)}>
                  <PlayArrowRounded style={{ fontSize: 20 }} />
               </button>
               <button {...stylex.props(styles.activeStoryTopNavigationRightButton)}>
                  <MoreHorizRounded style={{ fontSize: 20 }} />
               </button>
            </div>
         </div>
      </div>
   );
}
