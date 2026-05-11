'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import CarouselArrow from '@/src/components/CarouselArrow';
import UserAvatar from '@/src/components/UserAvatar';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import type { Post } from '../Main';
import { styles } from './index.stylex';

interface HomepagePostProps {
   post: Post;
   index: number;
}

export default function HomepagePost({ post, index }: HomepagePostProps) {
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const hasMultipleImages = post.media.length > 1;

   const handlePrevious = () => {
      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
   };

   const handleNext = () => {
      setCurrentImageIndex(prev => (prev < post.media.length - 1 ? prev + 1 : prev));
   };

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <UserAvatar
               src={post.user.avatar_url}
               alt={post.user.username}
               size={32}
               loading={index <= 2 ? 'eager' : 'lazy'}
            />
            <span {...stylex.props(styles.topUsername)}>{post.user.username}</span>
            <span {...stylex.props(styles.separator)}>•</span>
            <span {...stylex.props(styles.createdAt)}>{formatRelativeTimeShortUnit(post.createdAt)}</span>
            <TbDots {...stylex.props(styles.actionsIcon)} />
         </div>
         <div {...stylex.props(styles.carouselContainer)}>
            <div
               {...stylex.props(styles.carouselTrack)}
               style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
               {post.media.map((media, mediaIndex) => (
                  <div key={media.id} {...stylex.props(styles.carouselSlide)}>
                     <Image
                        src={media.url}
                        alt={media.type}
                        fill
                        sizes="468px"
                        {...stylex.props(styles.postImage)}
                        priority={index <= 2 && mediaIndex === 0}
                        loading={index <= 2 && mediaIndex === 0 ? 'eager' : 'lazy'}
                     />
                  </div>
               ))}
            </div>
            {hasMultipleImages && currentImageIndex > 0 && <CarouselArrow direction="left" onClick={handlePrevious} />}
            {hasMultipleImages && currentImageIndex < post.media.length - 1 && (
               <CarouselArrow direction="right" onClick={handleNext} />
            )}
            {hasMultipleImages && (
               <div {...stylex.props(styles.dotsContainer)}>
                  {post.media.map((media, dotIndex) => (
                     <button
                        key={media.id}
                        type="button"
                        aria-label={`Go to image ${dotIndex + 1}`}
                        onClick={() => setCurrentImageIndex(dotIndex)}
                        {...stylex.props(styles.dot, dotIndex === currentImageIndex && styles.dotActive)}
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
               {post.likesCount > 0 && <span>{post.likesCount}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Comment">
                  <FiMessageCircle size={24} />
               </button>
               {post.commentsCount > 0 && <span>{post.commentsCount}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button" aria-label="Repost">
                  <TbRepeat size={24} />
               </button>
               {post.repostsCount > 0 && <span>{post.repostsCount}</span>}
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
            <span {...stylex.props(styles.description)}>{post.description}</span>
         </div>
      </div>
   );
}
