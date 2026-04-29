'use client';

import type MuxPlayerElement from '@mux/mux-player';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { styles } from '../styles';
import { Layout, StoryEntry } from '../types';
import ActiveStoryOverlay from './ActiveStoryOverlay';
import MuxPlayer from './MuxPlayer';
import SideStoryOverlay from './SideStoryOverlay';

const PICTURE_DURATION = 6000;

interface StoryCardProps {
   story: StoryEntry;
   isCurrent: boolean;
   layout: Layout;
   currentUserIndex: number;
   onClick: () => void;
   formatTimestamp: (timestamp: string) => string;
   currentStoryMediaIndex: number;
   setPlayTime: Dispatch<SetStateAction<number>>;
   playTime: number;
   goToNextStoryMedia: () => void;
}

export default function StoryCard({
   story,
   isCurrent,
   layout,
   onClick,
   formatTimestamp,
   currentStoryMediaIndex,
   playTime,
   setPlayTime,
   goToNextStoryMedia,
}: StoryCardProps) {
   const [isPlaying, setIsPlaying] = useState(true);
   const mediaIndex = isCurrent ? currentStoryMediaIndex : 0;
   const currentMedia = { ...story.stories[mediaIndex] };
   const muxPlayerRef = useRef<MuxPlayerElement>(null);
   const picturePlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

   const { volume, setVolume } = usePlayerStore();
   useEffect(() => {
      const mediaEl = muxPlayerRef.current?.media;
      if (!mediaEl) return;
      mediaEl.volume = volume;
      mediaEl.muted = volume === 0;
   }, [volume]);

   const isVideo = !!currentMedia.videoLength;
   const videoDuration = isVideo ? (muxPlayerRef.current?.media?.duration ?? 0) * 1000 : PICTURE_DURATION;

   function onTimeUpdate(currentTime: number) {
      setPlayTime(currentTime * 1000);
   }

   useEffect(() => {
      if (!isCurrent) return;
      if (picturePlayIntervalRef.current) {
         clearInterval(picturePlayIntervalRef.current);
         picturePlayIntervalRef.current = null;
      }
      if (!isVideo) {
         setPlayTime(0);
         let elapsed = 0;
         picturePlayIntervalRef.current = setInterval(() => {
            elapsed += 100;
            if (elapsed >= PICTURE_DURATION) {
               clearInterval(picturePlayIntervalRef.current!);
               picturePlayIntervalRef.current = null;
               goToNextStoryMedia();
            } else {
               setPlayTime(elapsed);
            }
         }, 100);
      }
      return () => {
         if (picturePlayIntervalRef.current) {
            clearInterval(picturePlayIntervalRef.current);
            picturePlayIntervalRef.current = null;
         }
      };
   }, [mediaIndex]);

   function togglePlay(e: React.MouseEvent) {
      e.stopPropagation();
      setIsPlaying(!isPlaying);
      const mediaEl = muxPlayerRef.current?.media;

      if (!mediaEl) return;
      if (isPlaying) {
         mediaEl.pause();
      } else {
         mediaEl.play();
      }
   }

   function onVideoEnded() {
      goToNextStoryMedia();
      setPlayTime(0);
   }

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
            <ActiveStoryOverlay
               story={story}
               videoDuration={videoDuration}
               playTime={playTime}
               formatUploadTimestamp={formatTimestamp}
               isPlaying={isPlaying}
               onTogglePlay={togglePlay}
               volume={volume}
               setVolume={setVolume}
               currentStoryMediaIndex={currentStoryMediaIndex}
            />
         )}

         {!!currentMedia?.videoLength ? (
            <MuxPlayer
               key={currentMedia.id}
               ref={muxPlayerRef}
               style={{ width: '100%', height: '100%', '--bottom-controls': 'none' }}
               playbackId="HPbmwHABcTDuydWDsooCnkFRSGbCcr7OK00KJI5crh9g"
               autoPlay="always"
               onTimeUpdate={() =>
                  muxPlayerRef.current?.media?.currentTime &&
                  onTimeUpdate(muxPlayerRef.current?.media?.currentTime ?? 0)
               }
               onEnded={onVideoEnded}
               onPause={() => setIsPlaying(false)}
               onPlay={() => setIsPlaying(true)}
               paused={!isPlaying}
            />
         ) : (
            <>
               {!!currentMedia?.mediaUrl && (
                  <Image
                     src={currentMedia?.mediaUrl}
                     alt={story.username}
                     fill
                     loading="eager"
                     sizes="(max-width: 640px) 100vw, 33vw"
                  />
               )}
            </>
         )}
      </div>
   );
}
