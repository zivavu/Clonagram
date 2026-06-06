'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaRegFaceSmile } from 'react-icons/fa6';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import { getPostAction } from '@/src/actions/post/getPost';
import CommentItem, { CommentSkeleton, type OnReplyParams } from '@/src/components/CommentItem';
import OwnerActionsModal from '@/src/components/OwnerActionsModal/OwnerActionsModal';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useTogglePostLike } from '@/src/hooks/useTogglePostLike';
import { supabase } from '@/src/lib/supabase/client';
import { postCommentsQuery } from '@/src/queries/comments';
import type { PostWithMedia } from '@/src/queries/posts';
import { usePostViewModal } from '@/src/store/postViewModalStore';
import { useOwnerActionsModal } from '@/src/store/useOwnerActionsModalStore';
import { formatRelativeTimeLongUnit, formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from './index.stylex';
import { useSubmitComment } from './useSubmitComment';

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
   const { close: closePostViewModalStore, returnPath } = usePostViewModal();
   const router = useRouter();
   const { data: authUser } = useAuthUser();
   const postKey = ['post', initialPost.id];
   const commentsKey = ['comments', initialPost.id];

   const scrollAreaRef = useRef<HTMLDivElement>(null);
   const commentInputRef = useRef<HTMLInputElement>(null);

   const [commentInputValue, setCommentInputValue] = useState('');
   const [replyingTo, setReplyingTo] = useState<OnReplyParams | null>(null);

   const { data: post } = useQuery({
      initialData: initialPost,
      queryKey: postKey,
      queryFn: () => getPostAction(initialPost.id),
   });

   const { data: comments = [], isLoading: commentsLoading } = useQuery({
      queryKey: commentsKey,
      queryFn: async () => {
         const { data, error } = await postCommentsQuery(supabase, post.id);
         if (error) throw error;
         return data;
      },
   });

   useEffect(() => {
      if (scrollAreaRef.current && comments.length > 0) {
         scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
      }
   }, [comments]);

   const { mutate: togglePostLike } = useTogglePostLike(post);

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
         label: 'Comment',
         icon: <FiMessageCircle size={24} />,
         onClick: () => {
            commentInputRef.current?.focus();
         },
      },
      {
         label: 'Repost',
         icon: <TbRepeat size={24} />,
         onClick: () => {},
      },
      {
         label: 'Share',
         icon: <LuSend size={22} />,
         onClick: () => {},
      },
   ] as const;

   function handleReply(params: OnReplyParams) {
      setReplyingTo(params);
      setCommentInputValue(`@${params.username} `);
      commentInputRef.current?.focus();
   }

   function handleCommentSubmit(e: React.FormEvent) {
      e.preventDefault();
      const content = commentInputValue.trim();
      if (!content) return;
      setCommentInputValue('');
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
                  <OtherUserUsername style={styles.postHeaderUsername} userProfile={post.user} />
                  <span>•</span>
                  <span {...stylex.props(styles.followButton)}>Follow</span>
                  <button
                     type="button"
                     aria-label="Post owner actions"
                     onClick={() => openOwnerActions(post.id)}
                     {...stylex.props(styles.moreButton)}
                  >
                     <TbDots size={20} />
                  </button>
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
                           {isActive ? activeIcon : icon}
                        </button>
                     ))}
                  </div>
                  <button type="button" aria-label="Bookmark">
                     <MdBookmarkBorder size={24} />
                  </button>
               </div>
               <div {...stylex.props(styles.likedByText)}>
                  {post.likes.length === 1
                     ? `${post.likes.length} like`
                     : `${post.likes.length} likes`}
               </div>
               <div {...stylex.props(styles.postTime)}>
                  {post.created_at ? formatRelativeTimeLongUnit(post.created_at) : ''}
               </div>
               <form onSubmit={handleCommentSubmit} {...stylex.props(styles.commentInputRow)}>
                  <button type="button" aria-label="Emoji" {...stylex.props(styles.emojiButton)}>
                     <FaRegFaceSmile size={20} style={{ overflow: 'visible' }} />
                  </button>
                  <input
                     ref={commentInputRef}
                     type="text"
                     placeholder="Add a comment..."
                     value={commentInputValue}
                     onChange={e => setCommentInputValue(e.target.value)}
                     {...stylex.props(styles.commentInput)}
                  />
                  <button type="submit" {...stylex.props(styles.postButton)}>
                     Post
                  </button>
               </form>
            </div>
         </div>
      </>
   );
}
