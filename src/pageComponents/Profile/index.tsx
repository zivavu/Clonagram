import * as stylex from '@stylexjs/stylex';
import type { ProfileWithPosts } from '../../actions/profile/getUserProfileWithPosts';
import ProfileHeader from './components/ProfileHeader';
import ProfilePostGrid from './components/ProfilePostGrid';
import ProfileStoryHighlights from './components/ProfileStoryHighlights';
import ProfileTabs from './components/ProfileTabs';
import { styles } from './index.stylex';

interface ProfilePageProps extends ProfileWithPosts {
   isOwnProfile: boolean;
}

export default function ProfilePage({ userProfile, posts, isOwnProfile }: ProfilePageProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.topSection)}>
            <ProfileHeader
               userProfile={userProfile}
               postsCount={posts.length}
               isOwnProfile={isOwnProfile}
            />
            <ProfileStoryHighlights isOwnProfile={isOwnProfile} />
         </div>
         <ProfileTabs isOwnProfile={isOwnProfile} />
         <ProfilePostGrid posts={posts} />
      </div>
   );
}
