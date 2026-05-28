import * as stylex from '@stylexjs/stylex';
import { MdPerson } from 'react-icons/md';
import { getUserProfileWithPosts } from '../../../../actions/profile/getUserProfileWithPosts';
import { styles } from '../page.stylex';

interface ProfilePageProps {
   params: Promise<{
      username: string;
   }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
   const { username } = await params;

   const { userProfile, posts } = await getUserProfileWithPosts({ username });

   console.log({ userProfile, posts });
   return (
      <div {...stylex.props(styles.container)}>
         <MdPerson style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Profile</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
