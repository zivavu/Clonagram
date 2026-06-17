'use client';

import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';
import { MdCheckCircle, MdError } from 'react-icons/md';
import type { UsernameStatus } from '@/src/hooks/useUsernameAvailability';
import FloatingInput from '../FloatingInput';
import { styles } from './index.stylex';

interface UsernameSignupInputProps {
   value: string;
   onChange: (value: string) => void;
   onBlur?: () => void;
   status: UsernameStatus;
}

const UsernameSignupInput = forwardRef<HTMLInputElement, UsernameSignupInputProps>(
   function UsernameSignupInput({ value, onChange, onBlur, status }, ref) {
      const endAdornment =
         status === 'available' ? (
            <MdCheckCircle size={22} style={{ color: 'var(--colors-success)' }} />
         ) : status === 'taken' ? (
            <MdError size={22} style={{ color: 'var(--colors-danger)' }} />
         ) : null;

      const borderState =
         status === 'available' ? 'success' : status === 'taken' ? 'error' : undefined;

      return (
         <div {...stylex.props(styles.wrapper)}>
            <label htmlFor="username-signup" {...stylex.props(styles.topLabel)}>
               Username
            </label>
            <FloatingInput
               ref={ref}
               id="username-signup"
               label="Username"
               value={value}
               onChange={e => onChange(e.target.value)}
               onBlur={onBlur}
               endAdornment={endAdornment}
               borderState={borderState}
            />
            {status === 'taken' && (
               <span {...stylex.props(styles.errorMessage)}>
                  <MdError size={16} />
                  The username {value} is not available.
               </span>
            )}
         </div>
      );
   },
);

export default UsernameSignupInput;
