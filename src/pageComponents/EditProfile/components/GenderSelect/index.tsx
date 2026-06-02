import * as stylex from '@stylexjs/stylex';
import { MdCheck } from 'react-icons/md';
import { styles } from './index.stylex';

const GENDER_OPTIONS = ['Female', 'Male', 'Custom', 'Prefer not to say'] as const;

interface GenderSelectProps {
   value: string;
   onChange: (value: string) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
   return (
      <div {...stylex.props(styles.root)} role="radiogroup">
         {GENDER_OPTIONS.map(option => (
            <label key={option} {...stylex.props(styles.option)}>
               <input
                  {...stylex.props(styles.hiddenInput)}
                  type="radio"
                  name="gender"
                  value={option}
                  checked={value === option}
                  onChange={() => onChange(option)}
               />
               <span {...stylex.props(styles.label)}>{option}</span>
               <div {...stylex.props(styles.radio, value === option && styles.radioSelected)}>
                  {value === option && <MdCheck {...stylex.props(styles.checkmark)} size={16} />}
               </div>
            </label>
         ))}
      </div>
   );
}
