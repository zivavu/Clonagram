'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import Skeleton from '@/src/components/Skeleton';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useToggleCommentLike } from '@/src/hooks/useToggleCommentLike';
import type { PostComment } from '@/src/queries/comments';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import CommentReplies from '../CommentReplies';
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
}: CommentItemProps) {
   const { data: authUser } = useAuthUser();
   const [showReplies, setShowReplies] = useState(false);
   const { mutate: toggleLike } = useToggleCommentLike(comment, commentsKey);

   const isLiked = comment.comment_likes.some(cl => cl.user_id === authUser?.id);

   return (
      <div {...stylex.props(styles.wrapper)}>
         <div {...stylex.props(styles.commentItem)}>
            <div {...stylex.props(styles.commentAvatar)}>
               <UserAvatar src={comment.user.avatar_url} alt={comment.user.username} size={32} />
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
         {!isReply && showReplies && <CommentReplies parentId={comment.id} onReply={onReply} />}
      </div>
   );
}
