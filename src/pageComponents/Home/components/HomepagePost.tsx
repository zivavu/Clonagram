import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavoriteBorder } from 'react-icons/md';
import { TbRepeat } from 'react-icons/tb';
import { formatRelativeTimeShortUnit } from '@/src/utils/time';
import { styles } from './HomepagePost.stylex';
import type { Post } from './Main';

interface HomepagePostProps {
   post: Post;
   index: number;
}

export default function HomepagePost({ post, index }: HomepagePostProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <Image
               src={post.user.avatarUrl}
               alt={post.user.username}
               width={32}
               height={32}
               {...stylex.props(styles.avatarImage)}
               priority={index <= 2}
               loading={index <= 2 ? 'eager' : 'lazy'}
            />
            <span {...stylex.props(styles.topUsername)}>{post.user.username}</span>
            <span {...stylex.props(styles.separator)}>•</span>
            <span {...stylex.props(styles.createdAt)}>{formatRelativeTimeShortUnit(post.createdAt)}</span>
         </div>
         <Image
            src={post.media[0].url}
            alt={post.media[0].type}
            width={468}
            height={468}
            {...stylex.props(styles.postImage)}
         />
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
