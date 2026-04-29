'use client';

import type MuxPlayerElement from '@mux/mux-player';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { styles } from '../styles';
import { Layout, StoryEntry } from '../types';
import ActiveStoryOverlay from './ActiveStoryOverlay';
import MuxPlayer from './MuxPlayer';
import SideStoryOverlay from './SideStoryOverlay';

interface StoryCardProps {
   story: StoryEntry;
   isCurrent: boolean;
   layout: Layout;
   currentStoryIndex: number;
   onClick: () => void;
   formatTimestamp: (timestamp: string) => string;
}

export default function StoryCard({
   story,
   isCurrent,
   layout,
   currentStoryIndex,
   onClick,
   formatTimestamp,
}: StoryCardProps) {
   const media = story.stories[0];
   const [playTime, setPlayTime] = useState(0);
   const muxPlayerRef = useRef<MuxPlayerElement>(null);

   const videoDuration = (muxPlayerRef.current?.media?.duration ?? 0) * 1000;
   type MuxTimeUpdateEvent = CustomEvent<{ composed: true; detail: any }>;

   function onTimeUpdate(_event: MuxTimeUpdateEvent) {
      const currentTime = muxPlayerRef.current?.media?.currentTime ?? 0;
      setPlayTime(currentTime * 1000);
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
               currentStoryIndex={currentStoryIndex}
               formatUploadTimestamp={formatTimestamp}
            />
         )}

         {isCurrent ? (
            <MuxPlayer
               ref={muxPlayerRef}
               style={{ width: '100%', height: '100%', '--bottom-controls': 'none' }}
               playbackId="HPbmwHABcTDuydWDsooCnkFRSGbCcr7OK00KJI5crh9g"
               autoPlay="muted"
               onTimeUpdate={onTimeUpdate}
            />
         ) : (
            <Image
               src={media.mediaUrl}
               alt={story.username}
               fill
               loading="eager"
               sizes="(max-width: 640px) 100vw, 33vw"
            />
         )}
      </div>
   );
}
