import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface BioFieldProps {
   value: string;
   onChange: (value: string) => void;
}

export default function BioField({ value, onChange }: BioFieldProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <textarea
            {...stylex.props(styles.textarea)}
            value={value}
            onChange={e => onChange(e.target.value.slice(0, 150))}
            placeholder="Bio"
            rows={4}
         />
         <span {...stylex.props(styles.counter)}>{value.length} / 150</span>
      </div>
   );
}
