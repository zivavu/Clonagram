'use client';

import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import { styles } from './index.stylex';

interface StoryViewerProps {
   stories: ArchivedStory[];
   initialIndex: number;
   onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
   const [index, setIndex] = useState(initialIndex);
   const story = stories[index];
   const isFirst = index === 0;
   const isLast = index === stories.length - 1;

   useEffect(() => {
      function handleKey(e: KeyboardEvent) {
         if (e.key === 'ArrowLeft' && !isFirst) setIndex(i => i - 1);
         if (e.key === 'ArrowRight' && !isLast) setIndex(i => i + 1);
         if (e.key === 'Escape') onClose();
      }
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
   }, [isFirst, isLast, onClose]);

   const formattedDate = new Date(story.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
   });

   return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: overlay click closes modal, Escape handled via useEffect
      // biome-ignore lint/a11y/noStaticElementInteractions: overlay backdrop
      <div {...stylex.props(styles.overlay)} onClick={onClose}>
         {/* biome-ignore lint/a11y/useKeyWithClickEvents: stops overlay click, not an interactive element */}
         <div
            {...stylex.props(styles.container)}
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
         >
            <div {...stylex.props(styles.topBar)}>
               <span {...stylex.props(styles.date)}>{formattedDate}</span>
               <button type="button" {...stylex.props(styles.closeBtn)} onClick={onClose}>
                  <MdClose size={24} color="white" />
               </button>
            </div>
            <div {...stylex.props(styles.media)}>
               {story.type === 'image' ? (
                  story.blurDataUrl ? (
                     <Image
                        src={story.url}
                        alt=""
                        fill
                        unoptimized
                        placeholder="blur"
                        blurDataURL={story.blurDataUrl}
                        style={{ objectFit: 'cover' }}
                     />
                  ) : (
                     <Image
                        src={story.url}
                        alt=""
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                     />
                  )
               ) : (
                  <MuxPlayer
                     key={story.id}
                     disableCookies
                     style={{ width: '100%', height: '100%', '--bottom-controls': 'none' }}
                     playbackId={story.url}
                     autoPlay="always"
                  />
               )}
            </div>
            {!isFirst && (
               <button
                  type="button"
                  {...stylex.props(styles.navBtn, styles.navBtnLeft)}
                  onClick={() => setIndex(i => i - 1)}
               >
                  <MdChevronLeft size={24} color="white" />
               </button>
            )}
            {!isLast && (
               <button
                  type="button"
                  {...stylex.props(styles.navBtn, styles.navBtnRight)}
                  onClick={() => setIndex(i => i + 1)}
               >
                  <MdChevronRight size={24} color="white" />
               </button>
            )}
         </div>
      </div>
   );
}
