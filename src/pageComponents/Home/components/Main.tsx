import * as stylex from '@stylexjs/stylex';
import type { Media, PartialUser } from '@/src/types/global';
import HomepagePost from './HomepagePost';
import StoriesRow from './StoriesRow';

export interface Post {
   id: number;
   user: PartialUser;
   media: Media[];
   caption: string;
   likes: number;
   comments: number;
   createdAt: string;
}

const POSTS: Post[] = [
   {
      id: 1,
      user: {
         id: '1',
         username: 'aurora',
         avatarUrl: 'https://picsum.photos/seed/clona1/630/630',
      },
      media: [
         {
            id: '1',
            type: 'image',
            url: 'https://picsum.photos/seed/clona1/630/630',
         },
      ],
      likes: 1842,
      caption: 'lost somewhere between analog and digital 📼',
      comments: 34,
      createdAt: '2026-04-25T15:42:00Z',
   },
   {
      id: 2,
      user: {
         id: '2',
         username: 'jpeg.ghost',
         avatarUrl: 'https://picsum.photos/seed/clona2/630/630',
      },
      media: [
         {
            id: '2',
            type: 'image',
            url: 'https://picsum.photos/seed/clona2/630/630',
         },
      ],
      likes: 572,
      caption: 'the city never sleeps and neither do i ✦',
      comments: 11,
      createdAt: '2026-04-25T15:10:00Z',
   },
   {
      id: 3,
      user: {
         id: '3',
         username: 'velvet.avi',
         avatarUrl: 'https://picsum.photos/seed/clona3/630/630',
      },
      media: [
         {
            id: '3',
            type: 'image',
            url: 'https://picsum.photos/seed/clona3/630/420',
         },
      ],
      likes: 3201,
      caption: "golden hour hits different when you're not looking for it 🌅",
      comments: 89,
      createdAt: '2026-04-25T14:55:00Z',
   },
] as const;

const styles = stylex.create({
   root: {
      width: '630px',
      flexDirection: 'column',
      gap: '38px',
      display: 'flex',
      position: 'relative',
   },
   postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
   },
});

export default function Main() {
   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow />
         <div {...stylex.props(styles.postsContainer)}>
            {POSTS.map(post => (
               <HomepagePost key={post.id} post={post} />
            ))}
         </div>
      </main>
   );
}
