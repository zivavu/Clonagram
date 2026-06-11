import * as stylex from '@stylexjs/stylex';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { useUsernameAvailability } from '@/src/hooks/useUsernameAvailability';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { styles } from './index.stylex';

interface UsernameFieldProps {
   value: string;
   onChange: (value: string) => void;
   error: string | null;
   currentUsername: string;
}

export default function UsernameField({
   value,
   onChange,
   error,
   currentUsername,
}: UsernameFieldProps) {
   const status = useUsernameAvailability(value, { skip: currentUsername });

   const borderError = !!error || status === 'taken';
   const borderSuccess = !error && status === 'available' && value !== currentUsername;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.inputWrapper)}>
            <input
               {...stylex.props(
                  styles.input,
                  sharedStyles.placeholderMuted,
                  borderError && styles.inputError,
                  borderSuccess && styles.inputSuccess,
               )}
               type="text"
               value={value}
               onChange={e => onChange(e.target.value)}
               placeholder="Username"
            />
            {status === 'available' && value !== currentUsername && (
               <span {...stylex.props(styles.icon)}>
                  <MdCheckCircle style={{ fontSize: 18, color: 'var(--colors-success)' }} />
               </span>
            )}
            {status === 'taken' && (
               <span {...stylex.props(styles.icon)}>
                  <MdError style={{ fontSize: 18, color: 'var(--colors-danger)' }} />
               </span>
            )}
         </div>
         {(error || status === 'taken') && (
            <p {...stylex.props(styles.error)}>
               {error ?? `The username ${value} is not available.`}
            </p>
         )}
      </div>
   );
}
