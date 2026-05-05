import * as stylex from '@stylexjs/stylex';
import type { Media, PartialUser } from '@/src/types/global';
import HomepagePost from './HomepagePost';
import { styles } from './Main.stylex';
import StoriesRow from './StoriesRow';

export interface Post {
   id: number;
   user: PartialUser;
   media: Media[];
   description: string;
   likesCount: number;
   repostsCount: number;
   commentsCount: number;
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
      likesCount: 1842,
      description: 'lost somewhere between analog and digital 📼',
      commentsCount: 34,
      repostsCount: 12,
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
      likesCount: 572,
      description: 'the city never sleeps and neither do i ✦',
      commentsCount: 11,
      repostsCount: 19,
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
      likesCount: 3201,
      repostsCount: 333,
      description: "golden hour hits different when you're not looking for it 🌅",
      commentsCount: 89,
      createdAt: '2026-04-25T14:55:00Z',
   },
] as const;

export default function Main() {
   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow />
         <div {...stylex.props(styles.postsContainer)}>
            {POSTS.map((post, index) => (
               <HomepagePost key={post.id} post={post} index={index} />
            ))}
         </div>
      </main>
   );
}
