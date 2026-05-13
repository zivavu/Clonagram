'use client';

import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useState } from 'react';
import { LuSend } from 'react-icons/lu';
import {
   MdFavoriteBorder,
   MdMoreHoriz,
   MdPause,
   MdPlayArrow,
   MdVolumeDown,
   MdVolumeOff,
   MdVolumeUp,
} from 'react-icons/md';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from '../index.stylex';
import type { StoryEntry } from '../types';

interface ActiveStoryOverlayProps {
   story: StoryEntry;
   videoDuration: number;
   playTime: number;
   isVideo: boolean;
   pictureDurationMs: number;
   onPictureSegmentComplete: () => void;
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
   isVideo,
   pictureDurationMs,
   onPictureSegmentComplete,
   isPlaying,
   onTogglePlay,
   setVolume,
   volume,
   currentStoryMediaIndex,
}: ActiveStoryOverlayProps) {
   const [volumePopperOpen, setVolumePopperOpen] = useState(false);

   const onPictureAnimationEnd = useCallback(
      (e: React.AnimationEvent<HTMLDivElement>) => {
         if (e.target !== e.currentTarget) return;
         onPictureSegmentComplete();
      },
      [onPictureSegmentComplete],
   );

   const playedPct = videoDuration > 0 ? (playTime / videoDuration) * 100 : 0;
   const remainingPct = 100 - playedPct;

   return (
      <div {...stylex.props(styles.activeStoryOverlay)}>
         <div {...stylex.props(styles.activeStoryTopBar)}>
            <div {...stylex.props(styles.storyMediaBarsContainer)}>
               {story.stories.map((storyMedia, i) => {
                  if (i === currentStoryMediaIndex) {
                     if (!isVideo) {
                        return (
                           <div
                              key={storyMedia.id}
                              {...stylex.props(styles.storyMediaActiveStoryBarContainer)}
                           >
                              <div {...stylex.props(styles.storyPictureBarTrack)}>
                                 <div
                                    {...stylex.props(styles.storyPictureBarFill)}
                                    style={{
                                       animationDuration: `${pictureDurationMs}ms`,
                                       animationPlayState: isPlaying ? 'running' : 'paused',
                                    }}
                                    onAnimationEnd={onPictureAnimationEnd}
                                 />
                              </div>
                           </div>
                        );
                     }
                     return (
                        <div
                           key={storyMedia.id}
                           {...stylex.props(styles.storyMediaActiveStoryBarContainer)}
                        >
                           <div
                              {...stylex.props(
                                 styles.storyMediaBarItem,
                                 styles.storyMediaBarItemActive,
                              )}
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
                     {...stylex.props(styles.avatarImage)}
                  />
                  <span {...stylex.props(styles.activeStoryUsername)}>{story.username}</span>
                  <span {...stylex.props(styles.activeStoryUploadTimestamp)}>
                     {formatRelativeTimeShortUnit(story.timestamp)}
                  </span>
               </div>
               <div {...stylex.props(styles.activeStoryTopNavigationRight)}>
                  <Popover.Root open={volumePopperOpen} onOpenChange={setVolumePopperOpen}>
                     <Popover.Trigger asChild>
                        <button
                           type="button"
                           {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                        >
                           {volume === 0 ? (
                              <MdVolumeOff size={20} />
                           ) : volume < 0.5 ? (
                              <MdVolumeDown size={20} />
                           ) : (
                              <MdVolumeUp size={20} />
                           )}
                        </button>
                     </Popover.Trigger>
                     <Popover.Portal>
                        <Popover.Content
                           side="bottom"
                           align="end"
                           sideOffset={4}
                           {...stylex.props(styles.volumePopperPaper)}
                        >
                           <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={volume}
                              onChange={e => setVolume(Number(e.target.value))}
                              {...stylex.props(styles.volumeSlider)}
                           />
                        </Popover.Content>
                     </Popover.Portal>
                  </Popover.Root>
                  <button
                     type="button"
                     {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                     onClick={onTogglePlay}
                  >
                     {isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
                  </button>
                  <button
                     type="button"
                     {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                  >
                     <MdMoreHoriz size={20} />
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
               <MdFavoriteBorder size={26} />
            </button>
            <button type="button">
               <LuSend size={24} />
            </button>
         </div>
      </div>
   );
}
