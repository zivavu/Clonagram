'use client';

import * as stylex from '@stylexjs/stylex';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots } from 'react-icons/tb';
import { deleteCommentAction } from '@/src/actions/comments/deleteComment';
import Skeleton from '@/src/components/Skeleton';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useToggleCommentLike } from '@/src/hooks/useToggleCommentLike';
import type { PostComment, PostComments } from '@/src/queries/comments';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { toast } from '../AppToast';
import DeleteConfirmModal from '../DeleteConfirmModal';
import CommentReplies from './CommentReplies';
import CommentText from './CommentText';
import { styles } from './index.stylex';

export interface OnReplyParams {
   commentId: string;
   username: string;
}

interface CommentItemProps {
   comment: PostComment;
   commentsKey: unknown[];
   onReply: (params: OnReplyParams) => void;
   isReply?: boolean;
   postOwnerId: string;
}

export function CommentSkeleton() {
   return (
      <div {...stylex.props(styles.skeletonRow)}>
         <Skeleton width={32} height={32} rounded />
         <div {...stylex.props(styles.skeletonContent)}>
            <Skeleton width="40%" height={12} />
            <Skeleton width="75%" height={12} />
            <Skeleton width="25%" height={10} />
         </div>
      </div>
   );
}

export default function CommentItem({
   comment,
   commentsKey,
   onReply,
   isReply = false,
   postOwnerId,
}: CommentItemProps) {
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();
   const [showReplies, setShowReplies] = useState(false);
   const [isHovered, setIsHovered] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const { mutate: toggleLike } = useToggleCommentLike(comment, commentsKey);

   const isLiked = comment.comment_likes.some(cl => cl.user_id === authUser?.id);
   const canDelete = !!authUser && (authUser.id === comment.user.id || authUser.id === postOwnerId);

   const { mutate: deleteComment, isPending: isDeleting } = useMutation({
      mutationFn: () => deleteCommentAction({ commentId: comment.id }),
      onMutate: () => {
         const prev = queryClient.getQueryData<PostComments>(commentsKey as string[]);
         queryClient.setQueryData<PostComments>(commentsKey as string[], old =>
            (old ?? []).filter(c => c.id !== comment.id),
         );
         return { prev };
      },
      onError: (_err, _vars, context) => {
         if (context?.prev) queryClient.setQueryData(commentsKey as string[], context.prev);
         toast('Failed to delete comment.');
      },
      onSuccess: () => {
         setShowDeleteModal(false);
      },
   });

   return (
      <article
         {...stylex.props(styles.wrapper)}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <div {...stylex.props(styles.commentItem)}>
            <div {...stylex.props(styles.commentAvatar)}>
               <UserAvatar
                  src={comment.user.avatar_url}
                  alt={comment.user.username}
                  size={32}
                  userId={comment.user.id}
               />
            </div>
            <div {...stylex.props(styles.commentContent)}>
               <div {...stylex.props(styles.commentTextRow)}>
                  <OtherUserUsername style={styles.commentUsername} userProfile={comment.user} />{' '}
                  <CommentText content={comment.content} />
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
                  <button
                     type="button"
                     {...stylex.props(styles.commentReplyButton)}
                     onClick={() =>
                        onReply({ commentId: comment.id, username: comment.user.username })
                     }
                  >
                     Reply
                  </button>
                  {canDelete && (
                     <button
                        type="button"
                        aria-label="Comment options"
                        onClick={() => setShowDeleteModal(true)}
                        {...stylex.props(styles.dotsButton, isHovered && styles.dotsButtonVisible)}
                     >
                        <TbDots size={14} />
                     </button>
                  )}
               </div>
               {!isReply && comment.reply_count > 0 && (
                  <button
                     type="button"
                     {...stylex.props(styles.viewRepliesButton)}
                     onClick={() => setShowReplies(prev => !prev)}
                  >
                     <span {...stylex.props(styles.viewRepliesLine)} />
                     {showReplies
                        ? 'Hide replies'
                        : `View ${comment.reply_count} ${comment.reply_count === 1 ? 'reply' : 'replies'}`}
                  </button>
               )}
            </div>
            <button
               type="button"
               aria-label="Like comment"
               {...stylex.props(styles.commentHeart, isLiked && styles.commentHeartLiked)}
               onClick={() => toggleLike()}
            >
               {isLiked ? <MdFavorite size={12} /> : <MdFavoriteBorder size={12} />}
            </button>
         </div>
         {!isReply && showReplies && (
            <CommentReplies parentId={comment.id} onReply={onReply} postOwnerId={postOwnerId} />
         )}
         <DeleteConfirmModal
            open={showDeleteModal}
            onOpenChange={setShowDeleteModal}
            onConfirm={() => deleteComment()}
            isLoading={isDeleting}
            title="Delete comment?"
            description="Are you sure you want to delete this comment?"
         />
      </article>
   );
}
