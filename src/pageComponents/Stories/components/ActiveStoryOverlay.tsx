'use client';

import { FavoriteBorder, SendOutlined } from '@mui/icons-material';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import { Popper } from '@mui/material';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import type React from 'react';
import { useRef, useState } from 'react';
import { styles } from '../styles';
import { StoryEntry } from '../types';

interface ActiveStoryOverlayProps {
   story: StoryEntry;
   videoDuration: number;
   playTime: number;
   currentStoryIndex: number;
   formatUploadTimestamp: (timestamp: string) => string;
   isPlaying: boolean;
   onTogglePlay: (e: React.MouseEvent) => void;
   setVolume: (newVolume: number) => void;
   volume: number;
   muteVolumeSwitch: (e: React.MouseEvent) => void;
}

export default function ActiveStoryOverlay({
   story,
   videoDuration,
   playTime,
   currentStoryIndex,
   formatUploadTimestamp,
   isPlaying,
   onTogglePlay,
   setVolume,
   volume,
   muteVolumeSwitch,
}: ActiveStoryOverlayProps) {
   const [currentStoryMediaIndex, setCurrentStoryMediaIndex] = useState(0);
   const [volumePopprOpen, setVolumePopperOpen] = useState(false);

   const volumeAnchorEl = useRef<HTMLButtonElement>(null);

   const currentMedia = story.stories[currentStoryMediaIndex];

   const currentBarPlayedWidth = videoDuration > 0 ? (playTime / videoDuration) * 100 : 0;
   const currentBarRemainingWidth = 100 - currentBarPlayedWidth;

   return (
      <div {...stylex.props(styles.activeStoryOverlay)}>
         <div {...stylex.props(styles.activeStoryTopBar)}>
            <div {...stylex.props(styles.storyMediaBarsContainer)}>
               {story.stories.map((storyMedia, i) => {
                  return i === currentStoryMediaIndex ? (
                     <div key={storyMedia.id} {...stylex.props(styles.storyMediaActiveStoryBarContainer)}>
                        <div
                           {...stylex.props(styles.storyMediaBarItem, styles.storyMediaBarItemActive)}
                           style={{ width: `${currentBarPlayedWidth.toFixed(2)}%` }}
                        />
                        <div
                           {...stylex.props(styles.storyMediaBarItem)}
                           style={{ width: `${currentBarRemainingWidth.toFixed(2)}%` }}
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
                  <span {...stylex.props(styles.activeStoryUploadTimestamp)}>
                     {formatUploadTimestamp(story.timestamp)}
                  </span>
               </div>
               <div {...stylex.props(styles.activeStoryTopNavigationRight)}>
                  <button
                     ref={volumeAnchorEl}
                     onClick={() => setVolumePopperOpen(!volumePopprOpen)}
                     onDoubleClick={muteVolumeSwitch}
                     {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                  >
                     <VolumeUpRounded style={{ fontSize: 20 }} />
                  </button>
                  <Popper open={volumePopprOpen} anchorEl={volumeAnchorEl.current}>
                     <div>
                        <input
                           type="range"
                           min="0"
                           max="1"
                           step="0.01"
                           value={volume}
                           onChange={e => setVolume(Number(e.target.value))}
                        />
                     </div>
                  </Popper>
                  <button {...stylex.props(styles.activeStoryTopNavigationRightButton)} onClick={onTogglePlay}>
                     {isPlaying ? (
                        <PauseRounded style={{ fontSize: 20 }} />
                     ) : (
                        <PlayArrowRounded style={{ fontSize: 20 }} />
                     )}
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
