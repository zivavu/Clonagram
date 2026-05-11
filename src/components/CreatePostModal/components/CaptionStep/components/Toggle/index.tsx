'use client';

import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface ToggleProps {
   checked: boolean;
   onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
   return (
      <button
         type="button"
         role="switch"
         aria-checked={checked}
         onClick={() => onChange(!checked)}
         {...stylex.props(styles.toggle, checked && styles.toggleOn)}
      >
         <div {...stylex.props(styles.thumb, checked && styles.thumbOn)} />
      </button>
   );
}
