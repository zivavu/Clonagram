'use client';

import { FavoriteBorder, SendOutlined, VolumeDownRounded, VolumeOffRounded } from '@mui/icons-material';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import { ClickAwayListener, Popper } from '@mui/material';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import type React from 'react';
import { useRef, useState } from 'react';
import { styles } from '../styles';
import type { StoryEntry } from '../types';
import { formatTimestamp } from '../utils';

interface ActiveStoryOverlayProps {
   story: StoryEntry;
   videoDuration: number;
   playTime: number;
   isPlaying: boolean;
   onTogglePlay: (e: React.MouseEvent) => void;
   setVolume: (newVolume: number) => void;
   volume: number;
   currentStoryMediaIndex: number;
}

export default function ActiveStoryOverlay({
   story,
   videoDuration = 6000,
   playTime,
   isPlaying,
   onTogglePlay,
   setVolume,
   volume,
   currentStoryMediaIndex,
}: ActiveStoryOverlayProps) {
   const [volumePopperOpen, setVolumePopperOpen] = useState(false);
   const volumeAnchorEl = useRef<HTMLButtonElement>(null);

   const playedPct = videoDuration > 0 ? (playTime / videoDuration) * 100 : 0;
   const remainingPct = 100 - playedPct;

   return (
      <div {...stylex.props(styles.activeStoryOverlay)}>
         <div {...stylex.props(styles.activeStoryTopBar)}>
            <div {...stylex.props(styles.storyMediaBarsContainer)}>
               {story.stories.map((storyMedia, i) => {
                  if (i === currentStoryMediaIndex) {
                     return (
                        <div key={storyMedia.id} {...stylex.props(styles.storyMediaActiveStoryBarContainer)}>
                           <div
                              {...stylex.props(styles.storyMediaBarItem, styles.storyMediaBarItemActive)}
                              style={{ width: `${playedPct.toFixed(2)}%` }}
                           />
                           <div
                              {...stylex.props(styles.storyMediaBarItem)}
                              style={{ width: `${remainingPct.toFixed(2)}%` }}
                           />
                        </div>
                     );
                  }
                  return (
                     <div
                        key={storyMedia.id}
                        {...stylex.props(
                           styles.storyMediaBarItem,
                           i < currentStoryMediaIndex && styles.storyMediaBarItemActive,
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
                  <ClickAwayListener onClickAway={() => setVolumePopperOpen(false)}>
                     <span style={{ display: 'contents' }}>
                        <button
                           ref={volumeAnchorEl}
                           type="button"
                           onClick={() => setVolumePopperOpen(!volumePopperOpen)}
                           {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                        >
                           {volume === 0 ? (
                              <VolumeOffRounded style={{ fontSize: 20 }} />
                           ) : volume < 0.5 ? (
                              <VolumeDownRounded style={{ fontSize: 20 }} />
                           ) : (
                              <VolumeUpRounded style={{ fontSize: 20 }} />
                           )}
                        </button>
                        <Popper
                           open={volumePopperOpen}
                           anchorEl={volumeAnchorEl.current}
                           modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
                        >
                           <div {...stylex.props(styles.volumePopperPaper)}>
                              <input
                                 type="range"
                                 min="0"
                                 max="1"
                                 step="0.01"
                                 value={volume}
                                 onChange={e => setVolume(Number(e.target.value))}
                                 {...stylex.props(styles.volumeSlider)}
                              />
                           </div>
                        </Popper>
                     </span>
                  </ClickAwayListener>
                  <button
                     type="button"
                     {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                     onClick={onTogglePlay}
                  >
                     {isPlaying ? (
                        <PauseRounded style={{ fontSize: 20 }} />
                     ) : (
                        <PlayArrowRounded style={{ fontSize: 20 }} />
                     )}
                  </button>
                  <button type="button" {...stylex.props(styles.activeStoryTopNavigationRightButton)}>
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
            <button type="button">
               <FavoriteBorder style={{ fontSize: 26 }} />
            </button>
            <button type="button">
               <SendOutlined style={{ fontSize: 26, rotate: '-45deg' }} />
            </button>
         </div>
      </div>
   );
}
