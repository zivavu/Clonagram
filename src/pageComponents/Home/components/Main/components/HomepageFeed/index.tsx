import 'server-only';

import { getHomeFeedPosts } from '@/src/actions/post/getHomeFeedPosts';
import FeedList from './FeedList';

export default async function HomepageFeed({ variant }: { variant: 'home' | 'following' }) {
   const initialPage = await getHomeFeedPosts({ variant });

   return <FeedList variant={variant} initialPage={initialPage} />;
}
