'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { styles } from '../index.stylex';
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
   const mediaIndex = isCurrent ? currentStoryMediaIndex : 0;
   const currentMedia = story.stories[mediaIndex];
   const isVideo = currentMedia.type === 'video';

   const storyPlayerId = `story-${story.id}-${mediaIndex}`;

   const muxPlayerRef = useRef<MuxPlayerElement>(null);
   const [videoDuration, setVideoDuration] = useState<number>(PICTURE_DURATION);

   const { volume, activePlayerId, claimPlayback, releasePlayback } = usePlayerStore();
   const [isPlayingLocal, setIsPlayingLocal] = useState(true);

   const anotherVideoActive = activePlayerId !== null && activePlayerId !== storyPlayerId;
   const isPlaying = isPlayingLocal && !anotherVideoActive;

   useEffect(() => {
      const mediaEl = muxPlayerRef.current?.media;
      if (!mediaEl) return;
      mediaEl.volume = volume;
      mediaEl.muted = volume === 0;
   }, [volume]);

   useEffect(() => {
      if (!isCurrent) return;
      if (isPlaying) {
         claimPlayback(storyPlayerId);
      } else {
         releasePlayback(storyPlayerId);
      }
      return () => releasePlayback(storyPlayerId);
   }, [isCurrent, isPlaying, storyPlayerId, claimPlayback, releasePlayback]);

   function togglePlay(e: React.MouseEvent) {
      e.stopPropagation();
      const next = !isPlaying;
      setIsPlayingLocal(next);
      if (isVideo) {
         const mediaEl = muxPlayerRef.current?.media;
         if (next)
            mediaEl?.play()?.catch(err => {
               if (err?.name !== 'AbortError') throw err;
            });
         else mediaEl?.pause();
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
         {!isCurrent && <SideStoryOverlay story={story} />}
         {!isCurrent && (
            <button
               type="button"
               onClick={() => onClick()}
               {...stylex.props(styles.sideStoryClickTarget)}
            ></button>
         )}
         {isCurrent && (
            <ActiveStoryOverlay
               story={story}
               videoDuration={videoDuration}
               playTime={playTime}
               isVideo={isVideo}
               pictureDurationMs={PICTURE_DURATION}
               onPictureSegmentComplete={goToNextStoryMedia}
               isPlaying={isPlaying}
               onTogglePlay={togglePlay}
               currentStoryMediaIndex={currentStoryMediaIndex}
            />
         )}

         {isVideo ? (
            <MuxPlayer
               key={currentMedia.id}
               ref={muxPlayerRef}
               disableCookies
               style={{ width: '100%', height: '100%', '--bottom-controls': 'none' }}
               playbackId={currentMedia.url ?? ''}
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
               onPause={() => setIsPlayingLocal(false)}
               onPlay={() => setIsPlayingLocal(true)}
               paused={!isPlaying}
            />
         ) : (
            currentMedia.url && (
               <Image
                  src={currentMedia.url}
                  alt={story.username}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
               />
            )
         )}
      </div>
   );
}
