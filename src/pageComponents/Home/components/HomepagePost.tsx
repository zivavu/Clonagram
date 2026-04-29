import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import type { Post } from './Main';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
   },
   username: {
      fontSize: '14px',
      fontWeight: 'bold',
   },
});

interface HomepagePostProps {
   post: Post;
}
export default function HomepagePost({ post }: HomepagePostProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <Image
               src={post.user.avatarUrl}
               alt={post.user.username}
               width={32}
               height={32}
               style={{ borderRadius: '50%' }}
            />
            <span {...stylex.props(styles.username)}>{post.user}</span>
         </div>
      </div>
   );
}
