'use client';

import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import CarouselArrow from '@/src/components/CarouselArrow';
import UserAvatar from '@/src/components/UserAvatar';
import type { PostWithMedia } from '@/src/queries/posts';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { useAuthUser } from '../../../../hooks/useAuthUser';
import { styles } from './index.stylex';

interface HomepagePostProps {
   post: PostWithMedia;
   index: number;
}

interface UnifiedMedia {
   id: string;
   type: 'image' | 'video';
   url: string;
   position: number;
}

function containerHeight(aspectRatio: string): number {
   switch (aspectRatio) {
      case '16:9':
         return 263.25;
      case '1:1':
         return 468;
      case '4:5':
      case '9:16':
      default:
         return 585;
   }
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

export default function HomepagePost({ post }: HomepagePostProps) {
   const { data: currentUser } = useAuthUser();

   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const media = mergeMedia(post);
   const hasMultipleMedia = media.length > 1;
   const height = containerHeight(post.aspect_ratio);
   const isOwner = post.user.id === currentUser?.id;

   const handlePrevious = () => {
      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
   };

   const handleNext = () => {
      setCurrentImageIndex(prev => (prev < media.length - 1 ? prev + 1 : prev));
   };

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <UserAvatar src={post.user.avatar_url} alt={post.user.username} size={32} />
            <span {...stylex.props(styles.topUsername)}>{post.user.username}</span>
            <span {...stylex.props(styles.separator)}>•</span>
            <span {...stylex.props(styles.createdAt)}>
               {post.created_at ? formatRelativeTimeShortUnit(post.created_at) : ''}
            </span>
            {isOwner && (
               <button
                  type="button"
                  aria-label="Open Actions Modal"
                  {...stylex.props(styles.actionsIcon)}
               >
                  <TbDots {...stylex.props(styles.actionsIcon)} />
               </button>
            )}
         </div>
         <div {...stylex.props(styles.carouselContainer)} style={{ height: `${height}px` }}>
            <div
               {...stylex.props(styles.carouselTrack)}
               style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
               {media.map(item => (
                  <div key={item.id} {...stylex.props(styles.carouselSlide)}>
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
                  </div>
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
         <div {...stylex.props(styles.iconsBar)}>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Like">
                  <MdFavoriteBorder size={24} />
               </button>
               {post.like_count > 0 && <span>{post.like_count}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Comment">
                  <FiMessageCircle size={24} />
               </button>
               {post.comment_count > 0 && <span>{post.comment_count}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Repost">
                  <TbRepeat size={24} />
               </button>
            </div>
            <button type="button" aria-label="Share">
               <LuSend size={20} />
            </button>
            <button type="button" aria-label="Bookmark" style={{ marginLeft: 'auto' }}>
               <MdBookmarkBorder size={24} />
            </button>
         </div>
         <div {...stylex.props(styles.descriptionContainer)}>
            <span {...stylex.props(styles.bottomUsername)}>{post.user.username}</span>
            <span {...stylex.props(styles.description)}>{post.caption}</span>
         </div>
      </div>
   );
}
