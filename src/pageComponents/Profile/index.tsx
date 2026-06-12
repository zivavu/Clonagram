import * as stylex from '@stylexjs/stylex';
import type { ProfileWithPosts } from '../../actions/profile/getUserProfileWithPosts';
import type { UserHighlight } from '../../actions/story/getUserHighlights';
import FollowListModal from '../../components/FollowListModal';
import NewHighlightModal from '../../components/NewHighlightModal';
import type { PostWithMedia } from '../../queries/posts';
import OpenPostOnMount from './components/OpenPostOnMount';
import ProfileContent from './components/ProfileContent';
import ProfileHeader from './components/ProfileHeader';
import ProfileStoryHighlights from './components/ProfileStoryHighlights';
import { styles } from './index.stylex';

interface ProfilePageProps extends ProfileWithPosts {
   isOwnProfile: boolean;
   initialPost?: PostWithMedia | string;
   note?: string | null;
   savedPosts?: PostWithMedia[];
   ringState: { hasStories: boolean; allStoriesViewed: boolean };
   highlights: UserHighlight[];
}

export default function ProfilePage({
   userProfile,
   posts,
   followStatus,
   isOwnProfile,
   initialPost,
   note,
   savedPosts,
   ringState,
   highlights,
}: ProfilePageProps) {
   return (
      <div {...stylex.props(styles.root)}>
         {initialPost && <OpenPostOnMount post={initialPost} />}
         <FollowListModal />
         <NewHighlightModal />
         <div {...stylex.props(styles.topSection)}>
            <ProfileHeader
               userProfile={userProfile}
               postsCount={posts.length}
               isOwnProfile={isOwnProfile}
               followStatus={followStatus}
               note={note ?? null}
               ringState={ringState}
            />
            <ProfileStoryHighlights
               isOwnProfile={isOwnProfile}
               highlights={highlights}
               username={userProfile.username}
            />
         </div>
         <ProfileContent
            posts={posts}
            username={userProfile.username}
            isOwnProfile={isOwnProfile}
            savedPosts={savedPosts}
         />
      </div>
   );
}
