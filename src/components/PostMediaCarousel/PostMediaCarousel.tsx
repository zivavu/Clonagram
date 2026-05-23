'use client';

import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import type { PostWithMedia } from '../../queries/posts';
import { usePostViewModal } from '../../store/postViewModalStore';
import CarouselArrow from '../CarouselArrow';
import { styles } from './PostMediaCarousel.stylex';

interface UnifiedMedia {
   id: string;
   type: 'image' | 'video';
   url: string;
   position: number;
}

function mergeMedia(post: PostWithMedia): UnifiedMedia[] {
   const images: UnifiedMedia[] =
      post.images?.map(img => ({
         id: img.id,
         type: 'image' as const,
         url: img.url,
         position: img.position,
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
   height: number;
   width: number;
   initialImageIndex?: number;
   post: PostWithMedia;
}

export default function PostMediaCarousel({
   height,
   width,
   initialImageIndex,
   post,
}: PostMediaCarouselProps) {
   const { open: openPostFullViewModal } = usePostViewModal();

   const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex ?? 0);
   const media = mergeMedia(post);
   const hasMultipleMedia = media.length > 1;

   const handlePrevious = () => {
      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
   };

   const handleNext = () => {
      setCurrentImageIndex(prev => (prev < media.length - 1 ? prev + 1 : prev));
   };

   return (
      <div {...stylex.props(styles.root)} style={{ height: `${height}px`, width: `${width}px` }}>
         <div
            {...stylex.props(styles.carouselTrack)}
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
         >
            {media.map(item => (
               <button
                  onClick={() => openPostFullViewModal(post)}
                  key={item.id}
                  {...stylex.props(styles.carouselSlide)}
               >
                  {item.type === 'image' ? (
                     <Image
                        src={item.url}
                        alt="post"
                        fill
                        sizes="468px"
                        {...stylex.props(styles.postImage)}
                     />
                  ) : (
                     <MuxPlayer
                        style={{
                           width: '100%',
                           height: '100%',
                           '--bottom-controls': 'none',
                           '--media-object-fit': 'cover',
                        }}
                        playbackId={item.url}
                     />
                  )}
               </button>
            ))}
         </div>
         {hasMultipleMedia && currentImageIndex > 0 && (
            <CarouselArrow direction="left" onClick={handlePrevious} />
         )}
         {hasMultipleMedia && currentImageIndex < media.length - 1 && (
            <CarouselArrow direction="right" onClick={handleNext} />
         )}
         {hasMultipleMedia && (
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
   );
}
