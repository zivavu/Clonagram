import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { colors } from '@/src/styles/tokens.stylex';
import { formatRelativeTimeShortUnit } from '@/src/utils/utils';
import type { Post } from './Main';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      margin: '0 auto',
      width: '468px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      paddingLeft: '16px',
   },
   username: {
      fontSize: '0.9rem',
      fontWeight: 500,
      marginLeft: '8px',
   },
   createdAt: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
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
            <span {...stylex.props(styles.username)}>{post.user.username}</span>
            <span>•</span>
            <span {...stylex.props(styles.createdAt)}>{formatRelativeTimeShortUnit(post.createdAt)}</span>
         </div>
         <Image src={post.media[0].url} alt={post.media[0].type} width={468} height={468} />
      </div>
   );
}
