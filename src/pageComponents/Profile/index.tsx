import * as stylex from '@stylexjs/stylex';
import type { ProfileWithPosts } from '../../actions/profile/getUserProfileWithPosts';
import type { PostWithMedia } from '../../queries/posts';
import OpenPostOnMount from './components/OpenPostOnMount';
import ProfileContent from './components/ProfileContent';
import ProfileHeader from './components/ProfileHeader';
import ProfileStoryHighlights from './components/ProfileStoryHighlights';
import { styles } from './index.stylex';

interface ProfilePageProps extends ProfileWithPosts {
   isOwnProfile: boolean;
   initialPost?: PostWithMedia | string;
}

export default function ProfilePage({
   userProfile,
   posts,
   followStatus,
   isOwnProfile,
   initialPost,
}: ProfilePageProps) {
   return (
      <div {...stylex.props(styles.root)}>
         {initialPost && <OpenPostOnMount post={initialPost} />}
         <div {...stylex.props(styles.topSection)}>
            <ProfileHeader
               userProfile={userProfile}
               postsCount={posts.length}
               isOwnProfile={isOwnProfile}
               followStatus={followStatus}
            />
            <ProfileStoryHighlights isOwnProfile={isOwnProfile} />
         </div>
         <ProfileContent
            posts={posts}
            username={userProfile.username}
            isOwnProfile={isOwnProfile}
         />
      </div>
   );
}
