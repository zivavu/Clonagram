'use client';

import * as stylex from '@stylexjs/stylex';
import { MdAdd } from 'react-icons/md';
import { colors, radius, spacing } from '../../../../styles/tokens.stylex';
import StoriesRow from '../../../Home/components/Main/components/StoriesRow';

interface ProfileStoryHighlightsProps {
   isOwnProfile: boolean;
}

export default function ProfileStoryHighlights({ isOwnProfile }: ProfileStoryHighlightsProps) {
   return (
      <div {...stylex.props(styles.root)}>
         {isOwnProfile && (
            <div {...stylex.props(styles.highlightItem)}>
               <button type="button" {...stylex.props(styles.newHighlightButton)}>
                  <MdAdd size={32} color={colors.textSecondary} />
               </button>
               <span {...stylex.props(styles.highlightLabel)}>New</span>
            </div>
         )}
         {!isOwnProfile && <StoriesRow />}
      </div>
   );
}

const styles = stylex.create({
   root: {
      display: 'flex',
      gap: spacing.xl,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      overflowX: 'auto',
      width: '100%',
   },
   highlightItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.sm,
      flexShrink: 0,
   },
   newHighlightButton: {
      width: '77px',
      height: '77px',
      borderRadius: radius.full,
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg,
   },
   highlightRing: {
      width: '77px',
      height: '77px',
      borderRadius: radius.full,
      padding: '2px',
      background: `linear-gradient(45deg, ${colors.storyGradientStart}, ${colors.storyGradientEnd})`,
   },
   highlightImage: {
      borderRadius: radius.full,
      border: `2px solid ${colors.bg}`,
      objectFit: 'cover',
      width: '73px',
      height: '73px',
   },
   highlightLabel: {
      fontSize: '12px',
      color: colors.textPrimary,
      maxWidth: '77px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
});
