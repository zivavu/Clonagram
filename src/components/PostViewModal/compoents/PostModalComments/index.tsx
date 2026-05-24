import * as stylex from '@stylexjs/stylex';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TbDots, TbRepeat } from 'react-icons/tb';
import UserAvatar from '@/src/components/UserAvatar';
import { SUGGESTED_USERS } from '@/src/pageComponents/mocks/users';
import type { PostWithMedia } from '@/src/queries/posts';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from './index.stylex';

interface PostModalCommentsProps {
   post: PostWithMedia;
}

interface MockComment {
   id: string;
   username: string;
   avatarUrl: string | null;
   text: string;
   createdAt: string;
   likeCount: number;
   isLiked: boolean;
}

const MOCK_COMMENTS: MockComment[] = [
   {
      id: '1',
      username: SUGGESTED_USERS[0].username,
      avatarUrl: SUGGESTED_USERS[0].avatar_url,
      text: 'This is such a creative way to spend time on a trip. I really admire it 👏',
      createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
      likeCount: 0,
      isLiked: false,
   },
   {
      id: '2',
      username: SUGGESTED_USERS[1].username,
      avatarUrl: SUGGESTED_USERS[1].avatar_url,
      text: 'Mom how many likes to send me a little duckling 🐥',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likeCount: 1,
      isLiked: true,
   },
   {
      id: '3',
      username: SUGGESTED_USERS[2].username,
      avatarUrl: SUGGESTED_USERS[2].avatar_url,
      text: 'These ducklings are absolutely beautiful 😍❤️',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      likeCount: 42,
      isLiked: false,
   },
   {
      id: '4',
      username: SUGGESTED_USERS[3].username,
      avatarUrl: SUGGESTED_USERS[3].avatar_url,
      text: 'So gorgeous, I also have motion sickness and admire that you managed to do anything because I can barely function 😅😅',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      likeCount: 8,
      isLiked: false,
   },
   {
      id: '5',
      username: SUGGESTED_USERS[4].username,
      avatarUrl: SUGGESTED_USERS[4].avatar_url,
      text: 'What adorable little duckies 💕🦆',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      likeCount: 6,
      isLiked: false,
   },
   {
      id: '6',
      username: SUGGESTED_USERS[5].username,
      avatarUrl: SUGGESTED_USERS[5].avatar_url,
      text: 'Omg these are so beautiful ❤️',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      likeCount: 3,
      isLiked: false,
   },
   {
      id: '7',
      username: SUGGESTED_USERS[6].username,
      avatarUrl: SUGGESTED_USERS[6].avatar_url,
      text: 'I LOVE CROCHETING DUCKS THIS IS THE BEST HOBBY EVER',
      createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
      likeCount: 2,
      isLiked: false,
   },
   {
      id: '8',
      username: SUGGESTED_USERS[7].username,
      avatarUrl: SUGGESTED_USERS[7].avatar_url,
      text: 'Mom I want grilled cheese sandwiches 🥪✨',
      createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
      likeCount: 0,
      isLiked: false,
   },
];

function CommentItem({ comment }: { comment: MockComment }) {
   return (
      <div {...stylex.props(styles.commentItem)}>
         <div {...stylex.props(styles.commentAvatar)}>
            <UserAvatar src={comment.avatarUrl} alt={comment.username} size={32} />
         </div>
         <div {...stylex.props(styles.commentContent)}>
            <div {...stylex.props(styles.commentTextRow)}>
               <span {...stylex.props(styles.commentUsername)}>{comment.username}</span>{' '}
               <span {...stylex.props(styles.commentText)}>{comment.text}</span>
            </div>
            <div {...stylex.props(styles.commentMeta)}>
               <span {...stylex.props(styles.commentTime)}>
                  {formatRelativeTimeShortUnit(comment.createdAt)}
               </span>
               {comment.likeCount > 0 && (
                  <span {...stylex.props(styles.commentLikes)}>{comment.likeCount} likes</span>
               )}
               <button type="button" {...stylex.props(styles.commentReplyButton)}>
                  Reply
               </button>
            </div>
         </div>
         <button type="button" aria-label="Like comment" {...stylex.props(styles.commentHeart)}>
            {comment.isLiked ? (
               <MdFavorite size={12} {...stylex.props(styles.commentHeartLiked)} />
            ) : (
               <MdFavoriteBorder size={12} />
            )}
         </button>
      </div>
   );
}

export default function PostModalComments({ post }: PostModalCommentsProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.scrollArea)}>
            <div {...stylex.props(styles.postHeader)}>
               <UserAvatar src={post.user.avatar_url} alt={post.user.username} size={32} />
               <span {...stylex.props(styles.postHeaderUsername)}>{post.user.username}</span>
               <span {...stylex.props(styles.followButton)}>Follow</span>
               <button type="button" aria-label="More options" {...stylex.props(styles.moreButton)}>
                  <TbDots size={20} />
               </button>
            </div>
            {post.caption && (
               <div {...stylex.props(styles.captionRow)}>
                  <UserAvatar src={post.user.avatar_url} alt={post.user.username} size={32} />
                  <div {...stylex.props(styles.captionContent)}>
                     <div {...stylex.props(styles.captionTextRow)}>
                        <span {...stylex.props(styles.captionUsername)}>{post.user.username}</span>{' '}
                        <span {...stylex.props(styles.captionText)}>{post.caption}</span>
                     </div>
                     <span {...stylex.props(styles.captionTime)}>
                        {post.created_at ? formatRelativeTimeShortUnit(post.created_at) : ''}
                     </span>
                  </div>
               </div>
            )}
            <div {...stylex.props(styles.commentsList)}>
               {MOCK_COMMENTS.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
               ))}
            </div>
         </div>
         <div {...stylex.props(styles.bottomSection)}>
            <div {...stylex.props(styles.actionsBar)}>
               <div {...stylex.props(styles.actionsLeft)}>
                  <button type="button" aria-label="Like">
                     <MdFavoriteBorder size={24} />
                  </button>
                  <button type="button" aria-label="Comment">
                     <FiMessageCircle size={24} />
                  </button>
                  <button type="button" aria-label="Share">
                     <LuSend size={22} />
                  </button>
                  <button type="button" aria-label="Repost">
                     <TbRepeat size={24} />
                  </button>
               </div>
               <button type="button" aria-label="Bookmark">
                  <MdBookmarkBorder size={24} />
               </button>
            </div>
            <div {...stylex.props(styles.likedByText)}>
               Liked by <strong>volt_mz</strong> and others
            </div>
            <div {...stylex.props(styles.postTime)}>
               {post.created_at ? formatRelativeTimeShortUnit(post.created_at) : ''}
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
   );
}
