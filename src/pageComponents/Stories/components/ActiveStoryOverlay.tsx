'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import { LuSend } from 'react-icons/lu';
import { MdClose, MdFavorite, MdFavoriteBorder, MdPause, MdPlayArrow } from 'react-icons/md';
import type { StoryEntry } from '@/src/actions/story/getActiveStories';
import { replyToStory } from '@/src/actions/story/replyToStory';
import { toggleStoryReaction } from '@/src/actions/story/toggleStoryReaction';
import VolumeControl from '@/src/components/VolumeControl';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import UserAvatar from '../../../components/UserAvatar';
import OtherUserUsername from '../../../components/Username/OtherUserUsername';
import { styles } from '../index.stylex';

interface ActiveStoryOverlayProps {
   story: StoryEntry;
   videoDuration: number;
   playTime: number;
   isVideo: boolean;
   pictureDurationMs: number;
   onPictureSegmentComplete: () => void;
   isPlaying: boolean;
   onTogglePlay: (e: React.MouseEvent) => void;
   currentStoryMediaIndex: number;
   closeHref: string;
   showReply?: boolean;
   reactedStoryIds: string[];
}

export default function ActiveStoryOverlay({
   story,
   videoDuration = 6000,
   playTime,
   isVideo,
   pictureDurationMs,
   onPictureSegmentComplete,
   isPlaying,
   onTogglePlay,
   currentStoryMediaIndex,
   closeHref,
   showReply = true,
   reactedStoryIds,
}: ActiveStoryOverlayProps) {
   const currentStoryId = story.stories[currentStoryMediaIndex]?.userId ?? '';
   const [liked, setLiked] = useState(reactedStoryIds.includes(currentStoryId));
   const [replyText, setReplyText] = useState('');

   const onSendReply = async () => {
      const storyId = story.stories[currentStoryMediaIndex]?.userId;
      if (!storyId || !replyText.trim()) return;
      const text = replyText;
      setReplyText('');
      try {
         await replyToStory(storyId, text);
      } catch {
         setReplyText(text);
      }
   };

   const onPictureAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      onPictureSegmentComplete();
   };

   const onLike = async () => {
      const storyId = story.stories[currentStoryMediaIndex]?.userId;
      if (!storyId) return;
      const prev = liked;
      setLiked(!prev);
      try {
         await toggleStoryReaction(storyId, '\u2764\uFE0F');
      } catch {
         setLiked(prev);
      }
   };

   const playedPct = videoDuration > 0 ? (playTime / videoDuration) * 100 : 0;
   const remainingPct = 100 - playedPct;

   return (
      <div {...stylex.props(styles.activeStoryOverlay)}>
         <div {...stylex.props(styles.activeStoryTopBar)}>
            <div {...stylex.props(styles.storyMediaBarsContainer)}>
               {story.stories.map((storyMedia, i) => {
                  if (i === currentStoryMediaIndex) {
                     if (!isVideo) {
                        return (
                           <div
                              key={storyMedia.userId}
                              {...stylex.props(styles.storyMediaActiveStoryBarContainer)}
                           >
                              <div {...stylex.props(styles.storyPictureBarTrack)}>
                                 <div
                                    {...stylex.props(styles.storyPictureBarFill)}
                                    style={{
                                       animationDuration: `${pictureDurationMs}ms`,
                                       animationPlayState: isPlaying ? 'running' : 'paused',
                                    }}
                                    onAnimationEnd={onPictureAnimationEnd}
                                 />
                              </div>
                           </div>
                        );
                     }
                     return (
                        <div
                           key={storyMedia.userId}
                           {...stylex.props(styles.storyMediaActiveStoryBarContainer)}
                        >
                           <div
                              {...stylex.props(
                                 styles.storyMediaBarItem,
                                 styles.storyMediaBarItemActive,
                              )}
                              style={{ width: `${playedPct.toFixed(2)}%` }}
                           />
                           <div
                              {...stylex.props(styles.storyMediaBarItem)}
                              style={{ width: `${remainingPct.toFixed(2)}%` }}
                           />
                        </div>
                     );
                  }
                  return (
                     <div
                        key={storyMedia.userId}
                        {...stylex.props(
                           styles.storyMediaBarItem,
                           i < currentStoryMediaIndex && styles.storyMediaBarItemActive,
                        )}
                     />
                  );
               })}
            </div>

            <div {...stylex.props(styles.activeStoryTopNavigation)}>
               <div {...stylex.props(styles.activeStoryTopNavigationLeft)}>
                  <UserAvatar
                     alt={story.username}
                     src={story.avatarUrl}
                     size={32}
                     username={story.username}
                     userId={story.userId}
                  />
                  <OtherUserUsername userProfile={{ username: story.username, id: story.userId }} />
                  <span
                     {...stylex.props(styles.activeStoryUploadTimestamp)}
                     suppressHydrationWarning
                  >
                     {formatRelativeTimeShortUnit(story.timestamp)}
                  </span>
               </div>
               <div {...stylex.props(styles.activeStoryTopNavigationRight)}>
                  <span {...stylex.props(styles.activeStoryTopNavigationRightButton)}>
                     <VolumeControl side="bottom" />
                  </span>
                  <button
                     type="button"
                     {...stylex.props(styles.activeStoryTopNavigationRightButton)}
                     onClick={onTogglePlay}
                  >
                     {isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
                  </button>
                  <Link
                     href={closeHref}
                     {...stylex.props(
                        styles.activeStoryTopNavigationRightButton,
                        styles.mobileCloseButton,
                     )}
                  >
                     <MdClose size={24} />
                  </Link>
               </div>
            </div>
         </div>
         {showReply && (
            <div {...stylex.props(styles.activeStoryBottomBar)}>
               <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                     if (e.key === 'Enter') onSendReply();
                  }}
                  placeholder={`Reply to ${story.username}...`}
                  {...stylex.props(styles.activeStoryReplyToInput, sharedStyles.placeholderPrimary)}
               />
               <button type="button" onClick={onLike}>
                  {liked ? <MdFavorite size={26} color="red" /> : <MdFavoriteBorder size={26} />}
               </button>
               <button type="button" onClick={onSendReply}>
                  <LuSend size={24} />
               </button>
            </div>
         )}
      </div>
   );
}
