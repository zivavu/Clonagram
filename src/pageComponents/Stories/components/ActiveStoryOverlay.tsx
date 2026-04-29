'use client';

import { FavoriteBorder, SendOutlined } from '@mui/icons-material';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { styles } from '../styles';
import { StoryEntry } from '../types';

interface ActiveStoryOverlayProps {
   story: StoryEntry;
   currentStoryIndex: number;
   formatTimestamp: (timestamp: string) => string;
}

export default function ActiveStoryOverlay({ story, currentStoryIndex, formatTimestamp }: ActiveStoryOverlayProps) {
   const [isPlaying, setIsPlaying] = useState(true);
   const [playTime, setPlayTime] = useState(0);
   const [currentStoryMediaIndex, setCurrentStoryMediaIndex] = useState(0);

   return (
      <div {...stylex.props(styles.activeStoryOverlay)}>
         <div {...stylex.props(styles.activeStoryTopBar)}>
            <div {...stylex.props(styles.storyMediaBarsContainer)}>
               {story.stories.map((storyMedia, i) => {
                  return i === currentStoryMediaIndex ? (
                     <div key={storyMedia.id} {...stylex.props(styles.storyMediaActiveStoryBarContainer)}>
                        <div
                           {...stylex.props(styles.storyMediaBarItem, styles.storyMediaBarItemActive)}
                           style={{ width: `${storyMedia.videoLength}%` }}
                        />
                        <div
                           {...stylex.props(styles.storyMediaBarItem)}
                           style={{ width: `${100 - (storyMedia.videoLength ?? 0)}%` }}
                        />
                     </div>
                  ) : (
                     <div
                        key={storyMedia.id}
                        {...stylex.props(
                           styles.storyMediaBarItem,
                           i === currentStoryIndex && styles.storyMediaBarItemActive,
                        )}
                     />
                  );
               })}
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
                  <span {...stylex.props(styles.activeStoryUploadTimestamp)}>{formatTimestamp(story.timestamp)}</span>
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
         <div {...stylex.props(styles.activeStoryBottomBar)}>
            <input
               type="text"
               placeholder={`Reply to ${story.username}...`}
               {...stylex.props(styles.activeStoryReplyToInput)}
            />
            <button>
               <FavoriteBorder style={{ fontSize: 26 }} />
            </button>
            <button>
               <SendOutlined style={{ fontSize: 26, rotate: '-45deg' }} />
            </button>
         </div>
      </div>
   );
}
