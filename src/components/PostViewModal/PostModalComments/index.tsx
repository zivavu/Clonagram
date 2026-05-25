'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { type PostComment, postCommentsQuery } from '@/src/queries/comments';
import type { PostWithMedia } from '@/src/queries/posts';
import { formatRelativeTimeLongUnit, formatRelativeTimeShortUnit } from '@/src/utils/time';
import { usePostViewModal } from '../../../store/postViewModalStore';
import { useOwnerActionsModal } from '../../../store/useOwnerActionsModalStore';
import OwnerActionsModal from '../../OwnerActionsModal/OwnerActionsModal';
import { styles } from './index.stylex';

interface PostModalCommentsProps {
   post: PostWithMedia;
}

const ACTION_BUTTONS = [
   { label: 'Like', icon: <MdFavoriteBorder size={24} /> },
   { label: 'Comment', icon: <FiMessageCircle size={24} /> },
   { label: 'Share', icon: <LuSend size={22} /> },
   { label: 'Repost', icon: <TbRepeat size={24} /> },
] as const;

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

export default function PostModalComments({ post }: PostModalCommentsProps) {
   const { open: openOwnerActions } = useOwnerActionsModal();
   const { close: closePostViewModal } = usePostViewModal();
   const { data: comments = [] } = useQuery({
      queryKey: ['comments', post.id],
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await postCommentsQuery(supabase, post.id);
         if (error) throw error;
         return data;
      },
   });

   return (
      <>
         <OwnerActionsModal onFinish={() => closePostViewModal()} />

         <div {...stylex.props(styles.root)}>
            <div {...stylex.props(styles.scrollArea)}>
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
                  {comments.map(comment => (
                     <CommentItem key={comment.id} comment={comment} />
                  ))}
               </div>
            </div>
            <div {...stylex.props(styles.bottomSection)}>
               <div {...stylex.props(styles.actionsBar)}>
                  <div {...stylex.props(styles.actionsLeft)}>
                     {ACTION_BUTTONS.map(({ label, icon }) => (
                        <button key={label} type="button" aria-label={label}>
                           {icon}
                        </button>
                     ))}
                  </div>
                  <button type="button" aria-label="Bookmark">
                     <MdBookmarkBorder size={24} />
                  </button>
               </div>
               <div {...stylex.props(styles.likedByText)}>
                  Liked by <strong>volt_mz</strong> and others
               </div>
               <div {...stylex.props(styles.postTime)}>
                  {post.created_at ? formatRelativeTimeLongUnit(post.created_at) : ''}
               </div>
               <div {...stylex.props(styles.commentInputRow)}>
                  <button type="button" aria-label="Emoji" {...stylex.props(styles.emojiButton)}>
                     <BsEmojiSmile size={24} />
                  </button>
                  <input
                     type="text"
                     placeholder="Add a comment..."
                     {...stylex.props(styles.commentInput)}
                  />
                  <button type="button" {...stylex.props(styles.postButton)}>
                     Post
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}
