import { Separator } from '@radix-ui/react-dropdown-menu';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { colors } from '../../styles/tokens.stylex';
import Main from './components/Main';
import RightSidebar from './components/RightSidebar';

const styles = stylex.create({
   root: {
      gap: '12px',
      backgroundColor: colors.bg,
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
   },
   forYouFollowingContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '36px',
      paddingTop: '44px',
      paddingBottom: '26px',
   },
   forYouFollowingSwitch: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingLink: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingSwitchButtonLabel: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.textSecondary,
   },
   forYouFollowingTextActive: {
      color: colors.textPrimary,
   },
   separator: {
      width: '100%',
      height: '1px',
      backgroundColor: colors.borderMuted,
   },
   mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
});

export default function HomePage({ url }: { url: string | null }) {
   const isFollowingSelected = new URL(url || '').searchParams.get('variant') === 'following';

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.forYouFollowingContainer)}>
            <div {...stylex.props(styles.forYouFollowingSwitch)}>
               <Link href="?variant=home" aria-label="For You" {...stylex.props(styles.forYouFollowingLink)}>
                  <span
                     {...stylex.props(
                        styles.forYouFollowingSwitchButtonLabel,
                        !isFollowingSelected && styles.forYouFollowingTextActive,
                     )}
                  >
                     For you
                  </span>
               </Link>
               <Link href="?variant=following" aria-label="Following" {...stylex.props(styles.forYouFollowingLink)}>
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
               <Main />
               <RightSidebar />
            </div>
         </div>
      </div>
   );
}
