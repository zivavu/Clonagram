'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

interface ToggleProps {
   checked: boolean;
   onChange: (checked: boolean) => void;
}

const styles = stylex.create({
   toggle: {
      width: '44px',
      height: '24px',
      borderRadius: radius.full,
      backgroundColor: colors.textMuted,
      border: 'none',
      position: 'relative',
      flexShrink: 0,
      transition: 'background-color 0.2s',
   },
   toggleOn: {
      backgroundColor: colors.accent,
   },
   thumb: {
      position: 'absolute',
      width: '18px',
      height: '18px',
      borderRadius: radius.full,
      backgroundColor: colors.white,
      top: '3px',
      left: '3px',
      transition: 'left 0.2s',
   },
   thumbOn: {
      left: '23px',
   },
});

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
