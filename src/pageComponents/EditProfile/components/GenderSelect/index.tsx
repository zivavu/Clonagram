import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

const GENDER_OPTIONS = ['Female', 'Male', 'Custom', 'Prefer not to say'] as const;

interface GenderSelectProps {
   value: string;
   onChange: (value: string) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
   return (
      <div {...stylex.props(styles.root)}>
         {GENDER_OPTIONS.map(option => (
            <button
               key={option}
               type="button"
               {...stylex.props(styles.option)}
               onClick={() => onChange(option)}
            >
               <span>{option}</span>
               <div {...stylex.props(styles.radio, value === option && styles.radioSelected)}>
                  {value === option && <span {...stylex.props(styles.checkmark)}>✓</span>}
               </div>
            </button>
         ))}
      </div>
   );
}
