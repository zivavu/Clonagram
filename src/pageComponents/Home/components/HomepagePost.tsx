import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { FaRetweet } from 'react-icons/fa6';
import { FiMessageCircle } from 'react-icons/fi';
import { LuSend } from 'react-icons/lu';
import { MdBookmarkBorder, MdFavoriteBorder } from 'react-icons/md';
import { colors, radius } from '@/src/styles/tokens.stylex';
import { formatRelativeTimeShortUnit } from '@/src/utils/utils';
import type { Post } from './Main';


const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      width: '468px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      paddingLeft: '16px',
      marginBottom: '16px',
   },
   topUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '16px',
   },
   separator: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
   },
   createdAt: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
   },
   iconsBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      marginTop: '16px',
   },
   iconBarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: 500,
   },
   descriptionContainer: {
      display: 'flex',
      gap: '4px',
      marginLeft: '8px',
      marginTop: '8px',
   },
   bottomUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '8px',
   },
   description: {
      fontSize: '0.9rem',
      color: colors.textPrimary,
   },
});

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
               style={{ borderRadius: '50%' }}
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
            style={{ borderRadius: radius.xs }}
         />
         <div {...stylex.props(styles.iconsBar)}>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button">
                  <MdFavoriteBorder size={24} />
               </button>
               {post.likesCount > 0 && <span>{post.likesCount}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button">
                  <FiMessageCircle size={24} />
               </button>
               {post.commentsCount > 0 && <span>{post.commentsCount}</span>}
            </div>
            <div {...stylex.props(styles.iconBarItem)}>
               <button type="button">
                  <FaRetweet size={24} />
               </button>
               {post.repostsCount > 0 && <span>{post.repostsCount}</span>}
            </div>
            <button type="button">
               <LuSend size={20} />
            </button>
            <button type="button" style={{ marginLeft: 'auto' }}>
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
