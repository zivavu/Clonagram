'use client';

import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import { createCommentAction } from '@/src/actions/comments/createComment';
import Skeleton from '@/src/components/Skeleton';
import UserAvatar from '@/src/components/UserAvatar';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useTogglePostLike } from '@/src/hooks/useTogglePostLike';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { type PostComment, type PostComments, postCommentsQuery } from '@/src/queries/comments';
import type { PostWithMedia } from '@/src/queries/posts';
import { formatRelativeTimeLongUnit, formatRelativeTimeShortUnit } from '@/src/utils/time';
import { getPostAction } from '../../../actions/post/getPost';
import { usePostViewModal } from '../../../store/postViewModalStore';
import { useOwnerActionsModal } from '../../../store/useOwnerActionsModalStore';
import OwnerActionsModal from '../../OwnerActionsModal/OwnerActionsModal';
import { styles } from './index.stylex';

interface PostModalCommentsProps {
   initialPost: PostWithMedia;
}

function CommentSkeleton() {
   return (
      <div {...stylex.props(styles.commentItem)}>
         <Skeleton width={32} height={32} rounded />
         <div {...stylex.props(styles.commentContent)}>
            <Skeleton width="40%" height={12} />
            <Skeleton width="75%" height={12} />
            <Skeleton width="25%" height={10} />
         </div>
      </div>
   );
}

function CommentItem({ comment }: { comment: PostComment }) {
   return (
      <div {...stylex.props(styles.commentItem)}>
         <div {...stylex.props(styles.commentAvatar)}>
            <UserAvatar src={comment.user.avatar_url} alt={comment.user.username} size={32} />
         </div>
         <div {...stylex.props(styles.commentContent)}>
            <div {...stylex.props(styles.commentTextRow)}>
               <span {...stylex.props(styles.commentUsername)}>{comment.user.username}</span>{' '}
               <span {...stylex.props(styles.commentText)}>{comment.content}</span>
            </div>
            <div {...stylex.props(styles.commentMeta)}>
               <span>
                  {comment.created_at ? formatRelativeTimeShortUnit(comment.created_at) : ''}
               </span>
               {comment.like_count > 0 && (
                  <span>
                     {comment.like_count} {comment.like_count === 1 ? 'like' : 'likes'}
                  </span>
               )}
               <button type="button" {...stylex.props(styles.commentReplyButton)}>
                  Reply
               </button>
            </div>
         </div>
         <button type="button" aria-label="Like comment" {...stylex.props(styles.commentHeart)}>
            <MdFavoriteBorder size={12} />
         </button>
      </div>
   );
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
   const { close: closePostViewModal } = usePostViewModal();
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();
   const postKey = ['post', initialPost.id];
   const commentsKey = ['comments', initialPost.id];

   const scrollAreaRef = useRef<HTMLDivElement>(null);

   const [commentInputValue, setCommentInputValue] = useState('');
   const commentInputRef = useRef<HTMLInputElement>(null);

   const { data: post } = useQuery({
      initialData: initialPost,
      queryKey: postKey,
      queryFn: () => getPostAction(initialPost.id),
   });

   const { data: comments = [], isLoading: commentsLoading } = useQuery({
      queryKey: commentsKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
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

   const { mutate: submitComment } = useMutation({
      mutationFn: (content: string) => createCommentAction({ postId: post.id, content }),
      onMutate: async content => {
         await queryClient.cancelQueries({ queryKey: commentsKey });
         const previous = queryClient.getQueryData<PostComments>(commentsKey);

         if (authUser) {
            const optimistic: PostComment = {
               id: `optimistic-${Date.now()}`,
               content,
               created_at: new Date().toISOString(),
               like_count: 0,
               parent_id: null,
               user: {
                  id: authUser.id,
                  username: authUser.username,
                  avatar_url: authUser.avatar_url,
               },
            };
            queryClient.setQueryData<PostComment[]>(commentsKey, prev => [
               ...(prev ?? []),
               optimistic,
            ]);
         }

         return { previous };
      },
      onError: (_err, _content, context) => {
         if (context?.previous) {
            queryClient.setQueryData(commentsKey, context.previous);
         }
      },
      onSuccess: newComment => {
         queryClient.setQueryData<PostComment[]>(commentsKey, prev =>
            (prev ?? []).map(c => (c.id.startsWith('optimistic-') ? newComment : c)),
         );
      },
   });

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

   function handleCommentSubmit(e: React.SubmitEvent) {
      e.preventDefault();
      const content = commentInputValue.trim();
      if (!content) return;
      setCommentInputValue('');
      submitComment(content);
   }

   return (
      <>
         <OwnerActionsModal onFinish={() => closePostViewModal()} />

         <div {...stylex.props(styles.root)}>
            <div {...stylex.props(styles.scrollArea)} ref={scrollAreaRef}>
               <div {...stylex.props(styles.postHeader)}>
                  <UserAvatar src={post.user.avatar_url} alt={post.user.username} size={32} />
                  <span {...stylex.props(styles.postHeaderUsername)}>{post.user.username}</span>
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
                     <UserAvatar src={post.user.avatar_url} alt={post.user.username} size={32} />
                     <div {...stylex.props(styles.captionContent)}>
                        <div {...stylex.props(styles.captionTextRow)}>
                           <span {...stylex.props(styles.captionUsername)}>
                              {post.user.username}
                           </span>{' '}
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
                     : comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
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
                     <BsEmojiSmile size={24} />
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
