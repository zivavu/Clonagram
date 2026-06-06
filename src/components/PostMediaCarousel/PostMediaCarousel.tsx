'use client';

import * as stylex from '@stylexjs/stylex';
import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { PostWithMedia } from '../../queries/posts';
import { usePostViewModal } from '../../store/postViewModalStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import CarouselArrow from '../CarouselArrow';
import FeedVideoSlide from './FeedVideoSlide';
import { styles } from './PostMediaCarousel.stylex';

interface UnifiedMedia {
   id: string;
   type: 'image' | 'video';
   url: string;
   position: number;
   blurDataURL?: string;
}

function mergeMedia(post: PostWithMedia): UnifiedMedia[] {
   const images: UnifiedMedia[] =
      post.images?.map(img => ({
         id: img.id,
         type: 'image' as const,
         url: img.url,
         position: img.position,
         blurDataURL: img.blur_data_url ?? undefined,
      })) ?? [];

   const videos: UnifiedMedia[] =
      post.videos?.map(vid => ({
         id: vid.mux_playback_id ?? vid.id,
         type: 'video' as const,
         url: vid.mux_playback_id ?? '',
         position: vid.position,
      })) ?? [];

   return [...images, ...videos].sort((a, b) => a.position - b.position);
}

export interface PostMediaCarouselProps {
   height: HTMLButtonElement['style']['height'];
   width: HTMLButtonElement['style']['width'];
   initialImageIndex?: number;
   post: PostWithMedia;
   sizes: string;
   aspectRatio?: string;
   omitRightBorderRadius?: boolean;
   playerIdPrefix?: string;
   onImageChange?: (index: number) => void;
   onImageClick?: (post: PostWithMedia, index: number) => void;
   imageProps?: Partial<ImageProps>;
   dotsBelow?: boolean;
}

export default function PostMediaCarousel({
   height,
   width,
   initialImageIndex,
   post,
   sizes,
   aspectRatio,
   omitRightBorderRadius,
   playerIdPrefix = 'feed',
   onImageChange,
   onImageClick,
   imageProps,
   dotsBelow,
}: PostMediaCarouselProps) {
   const { open: openPostFullViewModal, isOpen: isPostFullViewModalOpen } = usePostViewModal();
   const { activePlayerId, claimPlayback, releasePlayback } = usePlayerStore();

   const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex ?? 0);
   const [isInViewport, setIsInViewport] = useState(false);
   const rootRef = useRef<HTMLDivElement>(null);

   const media = mergeMedia(post);
   const hasMultipleMedia = media.length > 1;

   const currentItem = media[currentImageIndex];
   const currentVideoId =
      currentItem?.type === 'video' ? `${playerIdPrefix}-${post.id}-${currentItem.id}` : null;

   useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
         ([entry]) => setIsInViewport(entry.isIntersecting),
         { threshold: 0.5 },
      );
      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   useEffect(() => {
      if (!currentVideoId) return;
      if (isInViewport) {
         claimPlayback(currentVideoId);
      } else {
         releasePlayback(currentVideoId);
      }
      return () => releasePlayback(currentVideoId);
   }, [currentVideoId, isInViewport, claimPlayback, releasePlayback]);

   const handlePrevious = () => {
      const newImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImageIndex;
      setCurrentImageIndex(newImageIndex);
      onImageChange?.(newImageIndex);
   };

   const handleNext = () => {
      const newImageIndex =
         currentImageIndex < media.length - 1 ? currentImageIndex + 1 : currentImageIndex;
      setCurrentImageIndex(newImageIndex);
      onImageChange?.(newImageIndex);
   };

   return (
      <div
         {...stylex.props(dotsBelow && styles.columnWrapper)}
         style={dotsBelow ? undefined : { height: `${height}`, aspectRatio }}
      >
         <div
            ref={rootRef}
            {...stylex.props(styles.root, omitRightBorderRadius && styles.omitRightBorderRadius)}
            style={{
               width: `${width}`,
               height: `${height}`,
               aspectRatio,
            }}
         >
            <div
               {...stylex.props(styles.carouselTrack)}
               style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
               {media.map(item => {
                  const videoId =
                     item.type === 'video' ? `${playerIdPrefix}-${post.id}-${item.id}` : null;
                  const isVideoPlaying = videoId !== null && activePlayerId === videoId;

                  if (item.type === 'video' && videoId) {
                     return (
                        <div
                           key={item.id}
                           {...stylex.props(styles.carouselSlide)}
                           style={{ width: `${width}`, height: `${height}`, aspectRatio }}
                        >
                           <FeedVideoSlide
                              playbackId={item.url}
                              isPlaying={isVideoPlaying}
                              onToggle={() => {
                                 if (isVideoPlaying) releasePlayback(videoId);
                                 else claimPlayback(videoId);
                              }}
                           />
                        </div>
                     );
                  }

                  return (
                     <button
                        key={item.id}
                        onClick={() => {
                           if (isPostFullViewModalOpen) return;
                           if (onImageClick) {
                              onImageClick(post, currentImageIndex);
                           } else {
                              openPostFullViewModal(post, { initialImageIndex: currentImageIndex });
                           }
                        }}
                        {...stylex.props(styles.carouselSlide)}
                        style={{
                           width: `${width}`,
                           height: `${height}`,
                           aspectRatio,
                           cursor: isPostFullViewModalOpen ? 'default' : 'pointer',
                        }}
                     >
                        <Image
                           src={item.url}
                           alt="post"
                           fill
                           sizes={sizes}
                           placeholder={item.blurDataURL ? 'blur' : 'empty'}
                           blurDataURL={item.blurDataURL}
                           {...imageProps}
                        />
                     </button>
                  );
               })}
            </div>
            {hasMultipleMedia && currentImageIndex > 0 && (
               <CarouselArrow direction="left" onClick={handlePrevious} />
            )}
            {hasMultipleMedia && currentImageIndex < media.length - 1 && (
               <CarouselArrow direction="right" onClick={handleNext} />
            )}
            {hasMultipleMedia && !dotsBelow && (
               <div {...stylex.props(styles.dotsContainer)}>
                  {media.map((_, dotIndex) => (
                     <button
                        key={media[dotIndex].id}
                        type="button"
                        aria-label={`Go to slide ${dotIndex + 1}`}
                        onClick={() => setCurrentImageIndex(dotIndex)}
                        {...stylex.props(
                           styles.dot,
                           dotIndex === currentImageIndex && styles.dotActive,
                        )}
                     />
                  ))}
               </div>
            )}
         </div>
         {hasMultipleMedia && dotsBelow && (
            <div {...stylex.props(styles.dotsContainerBelow)}>
               {media.map((_, dotIndex) => (
                  <button
                     key={media[dotIndex].id}
                     type="button"
                     aria-label={`Go to slide ${dotIndex + 1}`}
                     onClick={() => setCurrentImageIndex(dotIndex)}
                     {...stylex.props(
                        styles.dotBelow,
                        dotIndex === currentImageIndex && styles.dotBelowActive,
                     )}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
