import * as stylex from '@stylexjs/stylex';
import StoriesRow from './StoriesRow';

interface Post {
   id: number;
   username: string;
   avatarColor: string;
   imageUrl: string;
   likes: number;
   caption: string;
   comments: number;
   timeAgo: string;
}
const POSTS: Post[] = [
   {
      id: 1,
      username: 'aurora.mp4',
      avatarColor: '#e056fd',
      imageUrl: 'https://picsum.photos/seed/clona1/630/630',
      likes: 1842,
      caption: 'lost somewhere between analog and digital 📼',
      comments: 34,
      timeAgo: '2 hours ago',
   },
   {
      id: 2,
      username: 'jpeg.ghost',
      avatarColor: '#48dbfb',
      imageUrl: 'https://picsum.photos/seed/clona2/630/630',
      likes: 572,
      caption: 'the city never sleeps and neither do i ✦',
      comments: 11,
      timeAgo: '5 hours ago',
   },
   {
      id: 3,
      username: 'velvet.avi',
      avatarColor: '#ff9f43',
      imageUrl: 'https://picsum.photos/seed/clona3/630/420',
      likes: 3201,
      caption: "golden hour hits different when you're not looking for it 🌅",
      comments: 89,
      timeAgo: '8 hours ago',
   },
] as const;

const styles = stylex.create({
   root: {
      width: '630px',
      flexDirection: 'column',
      gap: '12px',
      display: 'flex',
      position: 'relative',
   },
});

export default function Main() {
   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow />
      </main>
   );
}
