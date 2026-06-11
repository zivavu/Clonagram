import * as stylex from '@stylexjs/stylex';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { styles } from './index.stylex';

interface NameFieldProps {
   value: string;
   onChange: (value: string) => void;
}

export default function NameField({ value, onChange }: NameFieldProps) {
   return (
      <input
         {...stylex.props(styles.input, sharedStyles.placeholderMuted)}
         type="text"
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder="Name"
      />
   );
}
