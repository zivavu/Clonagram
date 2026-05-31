'use client';

import * as stylex from '@stylexjs/stylex';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { styles } from './index.stylex';

interface ReelNavArrowsProps {
   onUp: () => void;
   onDown: () => void;
}

export default function ReelNavArrows({ onUp, onDown }: ReelNavArrowsProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <button
            type="button"
            onClick={onUp}
            aria-label="Previous reel"
            {...stylex.props(styles.button)}
         >
            <IoChevronUp size={22} />
         </button>
         <button
            type="button"
            onClick={onDown}
            aria-label="Next reel"
            {...stylex.props(styles.button)}
         >
            <IoChevronDown size={22} />
         </button>
      </div>
   );
}
