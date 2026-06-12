'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';
import type { UserHighlight } from '@/src/actions/story/getUserHighlights';
import { useNewHighlightModalStore } from '@/src/store/createModalStore';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

interface ProfileStoryHighlightsProps {
   isOwnProfile: boolean;
   highlights: UserHighlight[];
   username: string;
}

export default function ProfileStoryHighlights({
   isOwnProfile,
   highlights,
   username,
}: ProfileStoryHighlightsProps) {
   const openModal = useNewHighlightModalStore(s => s.open);

   if (!isOwnProfile && highlights.length === 0) return null;

   return (
      <div {...stylex.props(styles.root)}>
         {highlights.map(highlight => (
            <div key={highlight.id} {...stylex.props(styles.highlightItem)}>
               <Link
                  href={`/highlights/${username}/${highlight.id}`}
                  {...stylex.props(styles.highlightCircle)}
               >
                  {highlight.coverUrl ? (
                     <Image
                        src={highlight.coverUrl}
                        alt={highlight.title}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                     />
                  ) : (
                     <div {...stylex.props(styles.coverPlaceholder)} />
                  )}
               </Link>
               <span {...stylex.props(styles.highlightLabel)}>{highlight.title}</span>
            </div>
         ))}
         {isOwnProfile && (
            <div {...stylex.props(styles.highlightItem)}>
               <button
                  type="button"
                  onClick={openModal}
                  {...stylex.props(styles.newHighlightButton)}
               >
                  <MdAdd size={48} color={colors.textMuted} />
                  <div {...stylex.props(styles.newHighlightInner)} />
               </button>
               <span {...stylex.props(styles.highlightLabel)}>New</span>
            </div>
         )}
      </div>
   );
}
