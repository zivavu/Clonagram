'use client';

import * as stylex from '@stylexjs/stylex';
import { MdAdd } from 'react-icons/md';
import { colors } from '../../../../styles/tokens.stylex';
import StoriesRow from '../../../Home/components/Main/components/StoriesRow';
import { styles } from './index.stylex';

interface ProfileStoryHighlightsProps {
   isOwnProfile: boolean;
}

export default function ProfileStoryHighlights({ isOwnProfile }: ProfileStoryHighlightsProps) {
   return (
      <div {...stylex.props(styles.root)}>
         {isOwnProfile && (
            <div {...stylex.props(styles.highlightItem)}>
               <button type="button" {...stylex.props(styles.newHighlightButton)}>
                  <MdAdd size={48} color={colors.textMuted} />
                  <div {...stylex.props(styles.newHighlightInner)}></div>
               </button>
               <span {...stylex.props(styles.highlightLabel)}>New</span>
            </div>
         )}
         {!isOwnProfile && <StoriesRow />}
      </div>
   );
}
