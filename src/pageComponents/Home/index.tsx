import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { Suspense } from 'react';
import AiFilterReloadWrapper from '@/src/components/AiFilterReloadWrapper';
import Main from './components/Main';
import MainSkeleton from './components/Main/MainSkeleton';
import RightSidebar from './components/RightSidebar';
import RightSidebarSkeleton from './components/RightSidebar/RightSidebarSkeleton';
import SidebarFooter from './components/SidebarFooter';
import { styles } from './index.stylex';

export default async function HomePage({ variant }: { variant: 'following' | 'home' | null }) {
   const isFollowingSelected = variant === 'following';

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.forYouFollowingSwitch)}>
            <Link
               href="?variant=home"
               aria-label="For You"
               {...stylex.props(styles.forYouFollowingLink)}
            >
               <span
                  {...stylex.props(
                     styles.forYouFollowingSwitchButtonLabel,
                     !isFollowingSelected && styles.forYouFollowingTextActive,
                  )}
               >
                  For you
               </span>
            </Link>
            <Link
               href="?variant=following"
               aria-label="Following"
               {...stylex.props(styles.forYouFollowingLink)}
            >
               <span
                  {...stylex.props(
                     styles.forYouFollowingSwitchButtonLabel,
                     isFollowingSelected && styles.forYouFollowingTextActive,
                  )}
               >
                  Following
               </span>
            </Link>
         </div>
         <Separator {...stylex.props(styles.separator)} />
         <div {...stylex.props(styles.mainContainer)}>
            <AiFilterReloadWrapper skeleton={<MainSkeleton />}>
               <Suspense fallback={<MainSkeleton />}>
                  <Main variant={variant} />
               </Suspense>
            </AiFilterReloadWrapper>
            <div {...stylex.props(styles.sidebarSlot)}>
               <AiFilterReloadWrapper skeleton={<RightSidebarSkeleton />}>
                  <Suspense fallback={<RightSidebarSkeleton />}>
                     <RightSidebar />
                  </Suspense>
               </AiFilterReloadWrapper>
               <SidebarFooter />
            </div>
         </div>
      </div>
   );
}
