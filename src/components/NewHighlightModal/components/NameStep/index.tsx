'use client';

import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface NameStepProps {
   name: string;
   onChange: (name: string) => void;
}

export default function NameStep({ name, onChange }: NameStepProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <input
            type="text"
            placeholder="Highlight Name"
            value={name}
            onChange={e => onChange(e.target.value)}
            maxLength={100}
            {...stylex.props(styles.input)}
         />
      </div>
   );
}
