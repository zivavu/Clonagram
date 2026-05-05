'use client';
import * as stylex from '@stylexjs/stylex';
import FloatingInput, { type FloatingInputProps } from '../FloatingInput';
import { styles } from './index.stylex';

interface EmailSignupInputProps extends FloatingInputProps {
   topLabel: string;
}

export default function EmailSignupInput({ label, topLabel, onChange, ...props }: EmailSignupInputProps) {
   return (
      <div {...stylex.props(styles.wrapper)}>
         <label htmlFor={topLabel} {...stylex.props(styles.topLabel)}>
            {topLabel}
         </label>
         <FloatingInput id={topLabel} aria-label={label} label={label} {...props} onChange={onChange} />
      </div>
   );
}
