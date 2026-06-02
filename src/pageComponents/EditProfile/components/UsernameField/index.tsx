import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface UsernameFieldProps {
   value: string;
   onChange: (value: string) => void;
   error: string | null;
}

export default function UsernameField({ value, onChange, error }: UsernameFieldProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <input
            {...stylex.props(styles.input, !!error && styles.inputError)}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Username"
         />
         {error && <p {...stylex.props(styles.error)}>{error}</p>}
      </div>
   );
}
