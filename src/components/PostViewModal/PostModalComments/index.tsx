'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import {
   MdBookmark,
   MdBookmarkBorder,
   MdFavorite,
   MdFavoriteBorder,
   MdLocationOn,
} from 'react-icons/md';
import { TbDots } from 'react-icons/tb';
import { getPost } from '@/src/actions/post/getPost';
import CommentItem, { CommentSkeleton, type OnReplyParams } from '@/src/components/CommentItem';
import EmojiInput, { type EmojiInputRef } from '@/src/components/EmojiInput';
import FollowButton from '@/src/components/FollowButton';
import OwnerActionsModal from '@/src/components/OwnerActionsModal';
import RepostIcon from '@/src/components/RepostIcon';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { usePostComments } from '@/src/hooks/usePostComments';
import { useSubmitComment } from '@/src/hooks/useSubmitComment';
import { useTogglePostLike } from '@/src/hooks/useTogglePostLike';
import { useTogglePostRepost } from '@/src/hooks/useTogglePostRepost';
import { useTogglePostSave } from '@/src/hooks/useTogglePostSave';
import { queryKeys } from '@/src/lib/queryKeys';
import type { PostWithMedia } from '@/src/queries/posts';
import { useOwnerActionsModal, useSharePostModal } from '@/src/store/createModalStore';
import { usePostViewModal } from '@/src/store/usePostViewModalStore';
import { formatRelativeTimeLongUnit, formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from './index.stylex';

interface PostModalCommentsProps {
   initialPost: PostWithMedia;
}

interface ActionButton {
   label: string;
   icon: React.ReactNode;
   activeIcon?: React.ReactNode;
   isActive?: boolean;
   onClick: () => void;
}

export default function PostModalComments({ initialPost }: PostModalCommentsProps) {
   const { open: openOwnerActions } = useOwnerActionsModal();
   const { open: openShareModal } = useSharePostModal();
   const { close: closePostViewModalStore, returnPath } = usePostViewModal();
   const router = useRouter();
   const { data: authUser } = useAuthUser();
   const postKey = queryKeys.post(initialPost.id);

   const scrollAreaRef = useRef<HTMLDivElement>(null);
   const commentInputRef = useRef<EmojiInputRef>(null);

   const [replyingTo, setReplyingTo] = useState<OnReplyParams | null>(null);

   const { data: post } = useQuery({
      initialData: initialPost,
      queryKey: postKey,
      queryFn: () => getPost({ postId: initialPost.id }),
   });

   const { comments, commentsKey, isLoading: commentsLoading } = usePostComments(post.id);

   useEffect(() => {
      if (scrollAreaRef.current && comments.length > 0) {
         scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
      }
   }, [comments]);

   const { mutate: togglePostLike } = useTogglePostLike(post);
   const { mutate: togglePostRepost } = useTogglePostRepost(post);
   const { mutate: togglePostSave } = useTogglePostSave(post);

   const { mutate: submitComment } = useSubmitComment(post.id, commentsKey);

   const ACTION_BUTTONS: readonly ActionButton[] = [
      {
         label: 'Like',
         icon: <MdFavoriteBorder size={24} />,
         activeIcon: <MdFavorite size={24} />,
         isActive: post.likes.find(like => like.user_id === authUser?.id) !== undefined,
         onClick: togglePostLike,
      },
      {
         label: post.comments_off ? 'Comments disabled' : 'Comment',
         icon: <FiMessageCircle size={24} />,
         onClick: () => {
            if (post.comments_off) return;
            commentInputRef.current?.focus();
         },
      },
      {
         label: 'Repost',
         icon: (
            <RepostIcon
               size={24}
               isReposted={post.reposts?.some(r => r.user_id === authUser?.id) ?? false}
            />
         ),
         isActive: post.reposts?.some(r => r.user_id === authUser?.id) ?? false,
         onClick: togglePostRepost,
      },
      {
         label: 'Share',
         icon: <LuSend size={22} />,
         onClick: () => openShareModal(post.id),
      },
   ] as const;

   function handleReply(params: OnReplyParams) {
      setReplyingTo(params);
      commentInputRef.current?.setText(`@${params.username} `);
      commentInputRef.current?.focus();
   }

   function handleCommentSubmit(e?: React.FormEvent) {
      e?.preventDefault();
      const content = commentInputRef.current?.getText().trim() ?? '';
      if (!content) return;
      commentInputRef.current?.clear();
      submitComment({ content, parentId: replyingTo?.commentId });
      setReplyingTo(null);
   }

   return (
      <>
         <OwnerActionsModal
            onFinish={() => {
               const currentReturnPath = returnPath;
               closePostViewModalStore();
               if (currentReturnPath) {
                  history.replaceState(null, '', currentReturnPath);
               } else {
                  router.replace(`/profile/${initialPost.user.username}`);
               }
            }}
         />

         <div {...stylex.props(styles.root)}>
            <div {...stylex.props(styles.scrollArea)} ref={scrollAreaRef}>
               <div {...stylex.props(styles.postHeader)}>
                  <UserAvatar
                     src={post.user.avatar_url}
                     alt={post.user.username}
                     size={32}
                     username={post.user.username}
                     userId={post.user.id}
                  />
                  <div {...stylex.props(styles.headerMeta)}>
                     <div {...stylex.props(styles.headerTopRow)}>
                        <OtherUserUsername
                           style={styles.postHeaderUsername}
                           userProfile={post.user}
                        />
                        {post.collaborators && post.collaborators.length > 0 && (
                           <span {...stylex.props(styles.collaboratorsText)}>
                              {' and '}
                              {post.collaborators.map((c, i) => (
                                 <span key={c.user.id}>
                                    <OtherUserUsername
                                       style={styles.captionUsername}
                                       userProfile={c.user}
                                    />
                                    {i < post.collaborators.length - 1 && ', '}
                                 </span>
                              ))}
                           </span>
                        )}
                        {authUser?.id !== post.user.id &&
                           (!post.collaborators || post.collaborators.length === 0) && (
                              <>
                                 <span>•</span>
                                 <FollowButton
                                    targetUserId={post.user.id}
                                    targetIsPrivate={post.user.is_private ?? false}
                                    variant="sidebar"
                                    rootStyle={styles.inlineFollowButton}
                                 />
                              </>
                           )}
                     </div>
                     {post.location_name && (
                        <span {...stylex.props(styles.locationName)}>
                           <MdLocationOn size={12} />
                           {post.location_name}
                        </span>
                     )}
                  </div>
                  {authUser?.id === post.user.id && (
                     <button
                        type="button"
                        aria-label="Post owner actions"
                        onClick={() => openOwnerActions(post.id)}
                        {...stylex.props(styles.moreButton)}
                     >
                        <TbDots size={20} />
                     </button>
                  )}
               </div>
               {post.caption && (
                  <div {...stylex.props(styles.captionRow)}>
                     <UserAvatar
                        src={post.user.avatar_url}
                        alt={post.user.username}
                        size={32}
                        username={post.user.username}
                        userId={post.user.id}
                     />
                     <div {...stylex.props(styles.captionContent)}>
                        <div {...stylex.props(styles.captionTextRow)}>
                           <OtherUserUsername
                              style={styles.captionUsername}
                              userProfile={post.user}
                           />{' '}
                           <span {...stylex.props(styles.captionText)}>{post.caption}</span>
                        </div>
                        <span {...stylex.props(styles.captionTime)}>
                           {post.created_at ? formatRelativeTimeShortUnit(post.created_at) : ''}
                        </span>
                     </div>
                  </div>
               )}
               <div {...stylex.props(styles.commentsList)}>
                  {commentsLoading
                     ? ['a', 'b', 'c', 'd'].map(k => <CommentSkeleton key={k} />)
                     : comments.map(comment => (
                          <CommentItem
                             key={comment.id}
                             comment={comment}
                             commentsKey={commentsKey}
                             onReply={handleReply}
                             postOwnerId={post.user.id}
                          />
                       ))}
               </div>
            </div>
            <div {...stylex.props(styles.bottomSection)}>
               <div {...stylex.props(styles.actionsBar)}>
                  <div {...stylex.props(styles.actionsLeft)}>
                     {ACTION_BUTTONS.map(({ label, icon, onClick, activeIcon, isActive }) => (
                        <button
                           key={label}
                           name={label}
                           title={label}
                           type="button"
                           onClick={() => onClick()}
                           {...stylex.props(styles.actionButton)}
                        >
                           {isActive && activeIcon ? activeIcon : icon}
                        </button>
                     ))}
                  </div>
                  <button
                     type="button"
                     aria-label="Bookmark"
                     onClick={() => togglePostSave()}
                     {...stylex.props(styles.actionButton)}
                  >
                     {post.saves?.some(s => s.user_id === authUser?.id) ? (
                        <MdBookmark size={24} />
                     ) : (
                        <MdBookmarkBorder size={24} />
                     )}
                  </button>
               </div>
               {!post.hide_likes && (
                  <div {...stylex.props(styles.likedByText)}>
                     {post.like_count === 1
                        ? `${post.like_count} like`
                        : `${post.like_count} likes`}
                  </div>
               )}
               {(post.repost_count ?? 0) > 0 && (
                  <div {...stylex.props(styles.likedByText)}>
                     {post.repost_count === 1
                        ? `${post.repost_count} repost`
                        : `${post.repost_count} reposts`}
                  </div>
               )}
               <div {...stylex.props(styles.postTime)}>
                  {post.created_at ? formatRelativeTimeLongUnit(post.created_at) : ''}
               </div>
               {post.comments_off ? (
                  <div {...stylex.props(styles.commentsDisabledText)}>
                     Comments are disabled for this post
                  </div>
               ) : (
                  <form onSubmit={handleCommentSubmit} {...stylex.props(styles.commentInputRow)}>
                     <EmojiInput
                        ref={commentInputRef}
                        placeholder="Add a comment..."
                        onSubmit={handleCommentSubmit}
                        maxLength={1000}
                     />
                     <button type="submit" {...stylex.props(styles.postButton)}>
                        Post
                     </button>
                  </form>
               )}
            </div>
         </div>
      </>
   );
}
