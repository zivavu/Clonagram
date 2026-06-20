'use client';

import * as stylex from '@stylexjs/stylex';
import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { formatAltText } from '../../lib/altText';
import type { PostWithMedia } from '../../queries/posts';
import { usePlayerStore } from '../../store/usePlayerStore';
import { usePostViewModal } from '../../store/usePostViewModalStore';
import {
   parseUnsplashAttribution,
   type UnsplashAttribution as UnsplashAttributionType,
} from '../../types/unsplash';
import CarouselArrow from '../CarouselArrow';
import UnsplashAttribution from '../UnsplashAttribution';
import ImageTagPin from './components/ImageTagPin';
import FeedVideoSlide from './FeedVideoSlide';
import { styles } from './index.stylex';

interface ImageTag {
   id: string;
   x: number;
   y: number;
   username: string;
}

interface UnifiedMedia {
   id: string;
   type: 'image' | 'video';
   url: string;
   position: number;
   blurDataURL?: string;
   altText?: string;
   unsplashAttribution?: UnsplashAttributionType | null;
   tags: ImageTag[];
}

function mergeMedia(post: PostWithMedia): UnifiedMedia[] {
   const images: UnifiedMedia[] =
      post.images?.map((img, i) => ({
         id: img.id,
         type: 'image' as const,
         url: img.url,
         position: img.position,
         blurDataURL: img.blur_data_url ?? undefined,
         altText: formatAltText(img.alt_text, post, i),
         unsplashAttribution: parseUnsplashAttribution(img.unsplash_attribution),
         tags: img.tags?.map(t => ({ id: t.id, x: t.x, y: t.y, username: t.user.username })) ?? [],
      })) ?? [];

   const videos: UnifiedMedia[] =
      post.videos?.map(vid => ({
         id: vid.mux_playback_id ?? vid.id,
         type: 'video' as const,
         url: vid.mux_playback_id ?? '',
         position: vid.position,
         tags: [],
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
   const [tagsVisible, setTagsVisible] = useState(false);
   const rootRef = useRef<HTMLDivElement>(null);
   const touchStartX = useRef(0);
   const touchStartY = useRef(0);
   const didSwipe = useRef(false);

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

   const navigateTo = (newIndex: number) => {
      setCurrentImageIndex(newIndex);
      setTagsVisible(false);
      onImageChange?.(newIndex);
   };

   const handlePrevious = () => {
      if (currentImageIndex > 0) navigateTo(currentImageIndex - 1);
   };

   const handleNext = () => {
      if (currentImageIndex < media.length - 1) navigateTo(currentImageIndex + 1);
   };

   const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      didSwipe.current = false;
   };

   const handleTouchEnd = (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      didSwipe.current = true;
      if (deltaX < 0) handleNext();
      else handlePrevious();
   };

   const handleImageClick = (item: UnifiedMedia) => {
      if (didSwipe.current) return;
      if (item.tags.length > 0) {
         setTagsVisible(v => !v);
         return;
      }
      if (isPostFullViewModalOpen) return;
      if (onImageClick) {
         onImageClick(post, currentImageIndex);
      } else {
         openPostFullViewModal(post, { initialImageIndex: currentImageIndex });
      }
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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
                     // biome-ignore lint/a11y/useSemanticElements: <Link> tags inside prevent using <button>
                     <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleImageClick(item)}
                        onKeyDown={e => {
                           if (e.key === 'Enter' || e.key === ' ') handleImageClick(item);
                        }}
                        {...stylex.props(
                           styles.carouselSlide,
                           styles.imageSlide,
                           isPostFullViewModalOpen && styles.imageSlideDefault,
                        )}
                        style={{ width: `${width}`, height: `${height}`, aspectRatio }}
                     >
                        <Image
                           src={item.url}
                           alt={item.altText ?? ''}
                           fill
                           sizes={sizes}
                           placeholder={item.blurDataURL ? 'blur' : 'empty'}
                           blurDataURL={item.blurDataURL}
                           {...imageProps}
                        />
                        {item.unsplashAttribution && (
                           <UnsplashAttribution attribution={item.unsplashAttribution} />
                        )}
                        {tagsVisible &&
                           item.tags.map(tag => (
                              <ImageTagPin
                                 key={tag.id}
                                 username={tag.username}
                                 x={tag.x}
                                 y={tag.y}
                              />
                           ))}
                     </div>
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
                        onClick={() => navigateTo(dotIndex)}
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
                     onClick={() => navigateTo(dotIndex)}
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
