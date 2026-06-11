'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { StoryEntry } from '@/src/actions/story/getActiveStories';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { styles } from '../index.stylex';
import type { Layout } from '../types';
import ActiveStoryOverlay from './ActiveStoryOverlay';
import SideStoryOverlay from './SideStoryOverlay';

const PICTURE_DURATION = 6000;

interface StoryCardProps {
   story: StoryEntry;
   isCurrent: boolean;
   layout: Layout;
   onClick: () => void;
   currentStoryMediaIndex: number;
   goToNextStoryMedia: () => void;
   closeHref: string;
   showReply?: boolean;
   reactedStoryIds: string[];
}

export default function StoryCard({
   story,
   isCurrent,
   layout,
   onClick,
   currentStoryMediaIndex,
   goToNextStoryMedia,
   closeHref,
   showReply = true,
   reactedStoryIds,
}: StoryCardProps) {
   const [displayedIndex, setDisplayedIndex] = useState(0);
   useEffect(() => {
      if (isCurrent) {
         setDisplayedIndex(currentStoryMediaIndex);
         return;
      }
      const t = setTimeout(() => setDisplayedIndex(0), 400);
      return () => clearTimeout(t);
   }, [isCurrent, currentStoryMediaIndex]);

   const mediaIndex = displayedIndex;
   const currentMedia = story.stories[mediaIndex];
   const isVideo = currentMedia.type === 'video';

   const storyPlayerId = `story-${story.slug}-${mediaIndex}`;

   const muxPlayerRef = useRef<MuxPlayerElement>(null);
   const [videoDuration, setVideoDuration] = useState<number>(PICTURE_DURATION);
   const [playTime, setPlayTime] = useState(0);

   const { volume, activePlayerId, claimPlayback, releasePlayback } = usePlayerStore();
   const [isPlayingLocal, setIsPlayingLocal] = useState(true);

   const anotherVideoActive = activePlayerId !== null && activePlayerId !== storyPlayerId;
   const isPlaying = isPlayingLocal && !anotherVideoActive;

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
               key={story.stories[currentStoryMediaIndex]?.userId ?? ''}
               story={story}
               videoDuration={videoDuration}
               playTime={playTime}
               isVideo={isVideo}
               pictureDurationMs={PICTURE_DURATION}
               onPictureSegmentComplete={goToNextStoryMedia}
               isPlaying={isPlaying}
               onTogglePlay={togglePlay}
               currentStoryMediaIndex={currentStoryMediaIndex}
               closeHref={closeHref}
               showReply={showReply}
               reactedStoryIds={reactedStoryIds}
            />
         )}

         <div
            {...stylex.props(styles.mediaLayer)}
            style={{
               width: `${layout.mainWidth}px`,
               height: `${layout.mainHeight}px`,
               transform: `translate(-50%, -50%) scale(${
                  isCurrent ? 1 : layout.sideHeight / layout.mainHeight
               })`,
            }}
         >
            {isVideo ? (
               <MuxPlayer
                  key={currentMedia.userId}
                  ref={muxPlayerRef}
                  disableCookies
                  volume={volume}
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
                     unoptimized
                     placeholder={currentMedia.blurDataUrl ? 'blur' : 'empty'}
                     blurDataURL={currentMedia.blurDataUrl ?? undefined}
                  />
               )
            )}
         </div>
      </div>
   );
}
