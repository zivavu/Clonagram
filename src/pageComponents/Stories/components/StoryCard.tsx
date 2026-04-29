'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { styles } from '../styles';
import type { Layout, StoryEntry } from '../types';
import ActiveStoryOverlay from './ActiveStoryOverlay';
import SideStoryOverlay from './SideStoryOverlay';

const PICTURE_DURATION = 6000;

interface StoryCardProps {
   story: StoryEntry;
   isCurrent: boolean;
   layout: Layout;
   onClick: () => void;
   currentStoryMediaIndex: number;
   playTime: number;
   setPlayTime: (time: number) => void;
   goToNextStoryMedia: () => void;
}

export default function StoryCard({
   story,
   isCurrent,
   layout,
   onClick,
   currentStoryMediaIndex,
   playTime,
   setPlayTime,
   goToNextStoryMedia,
}: StoryCardProps) {
   const [isPlaying, setIsPlaying] = useState(true);
   console.log('isPlaying', isPlaying);

   const mediaIndex = isCurrent ? currentStoryMediaIndex : 0;
   const currentMedia = story.stories[mediaIndex];
   const isVideo = currentMedia.type === 'video';

   const muxPlayerRef = useRef<MuxPlayerElement>(null);

   const [videoDuration, setVideoDuration] = useState<number>(PICTURE_DURATION);

   const { volume, setVolume } = usePlayerStore();

   useEffect(() => {
      const mediaEl = muxPlayerRef.current?.media;
      if (!mediaEl) return;
      mediaEl.volume = volume;
      mediaEl.muted = volume === 0;
   }, [volume]);

   // biome-ignore lint/correctness/useExhaustiveDependencies: <The dep array is just right :3>
   useEffect(() => {
      let elapsed = 0;
      if (!isCurrent || isVideo) return;

      const timer = setInterval(() => {
         elapsed += 50;
         if (elapsed >= PICTURE_DURATION) {
            clearInterval(timer);
            goToNextStoryMedia();
         } else {
            setPlayTime(elapsed);
         }
      }, 50);

      if (!isPlaying) {
         clearInterval(timer);
      }
      return () => clearInterval(timer);
   }, [mediaIndex, isCurrent, isPlaying]);

   function togglePlay(e: React.MouseEvent) {
      e.stopPropagation();
      if (!isVideo) setIsPlaying(!isPlaying);
      else {
         const nextPlaying = !isPlaying;
         setIsPlaying(nextPlaying);
         const mediaEl = muxPlayerRef.current?.media;
         if (!mediaEl) return;
         if (nextPlaying) {
            mediaEl.play();
         } else {
            mediaEl.pause();
         }
      }
   }

   return (
      <div
         {...stylex.props(styles.story, !layout.isMobile && styles.storyRounded)}
         style={{
            width: `${isCurrent ? layout.mainWidth : layout.sideWidth}px`,
            height: `${isCurrent ? layout.mainHeight : layout.sideHeight}px`,
         }}
      >
         <button
            type="button"
            onClick={() => (isCurrent ? onClick() : setIsPlaying(prev => !prev))}
            {...stylex.props(styles.sideStoryClickTarget)}
         ></button>
         {!isCurrent && <SideStoryOverlay story={story} />}
         {isCurrent && (
            <ActiveStoryOverlay
               story={story}
               videoDuration={videoDuration}
               playTime={playTime}
               isPlaying={isPlaying}
               onTogglePlay={togglePlay}
               volume={volume}
               setVolume={setVolume}
               currentStoryMediaIndex={currentStoryMediaIndex}
            />
         )}

         {isVideo ? (
            <MuxPlayer
               key={currentMedia.id}
               ref={muxPlayerRef}
               style={{ width: '100%', height: '100%', '--bottom-controls': 'none' }}
               playbackId="HPbmwHABcTDuydWDsooCnkFRSGbCcr7OK00KJI5crh9g"
               autoPlay="always"
               onTimeUpdate={() => {
                  const time = muxPlayerRef.current?.media?.currentTime;
                  if (time) setPlayTime(time * 1000);
               }}
               onDurationChange={() => {
                  const duration = muxPlayerRef.current?.media?.duration;
                  if (duration && duration > 0) setVideoDuration(duration * 1000);
               }}
               onEnded={goToNextStoryMedia}
               onPause={() => setIsPlaying(false)}
               onPlay={() => setIsPlaying(true)}
               paused={!isPlaying}
            />
         ) : (
            currentMedia.mediaUrl && (
               <Image
                  src={currentMedia.mediaUrl}
                  alt={story.username}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, 33vw"
               />
            )
         )}
      </div>
   );
}
