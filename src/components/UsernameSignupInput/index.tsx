'use client';

import * as stylex from '@stylexjs/stylex';
import { forwardRef, useEffect } from 'react';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { type UsernameStatus, useUsernameAvailability } from '@/src/hooks/useUsernameAvailability';
import FloatingInput from '../FloatingInput';
import { styles } from './index.stylex';

interface UsernameSignupInputProps {
   value: string;
   onChange: (value: string) => void;
   onBlur?: () => void;
   onStatusChange?: (status: UsernameStatus) => void;
}

const UsernameSignupInput = forwardRef<HTMLInputElement, UsernameSignupInputProps>(
   function UsernameSignupInput({ value, onChange, onBlur, onStatusChange }, ref) {
      const status = useUsernameAvailability(value);

      useEffect(() => {
         onStatusChange?.(status);
      }, [status, onStatusChange]);

      const endAdornment =
         status === 'available' ? (
            <MdCheckCircle style={{ fontSize: 22, color: 'var(--colors-success)' }} />
         ) : status === 'taken' ? (
            <MdError style={{ fontSize: 22, color: 'var(--colors-danger)' }} />
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
                  <MdError style={{ fontSize: 16 }} />
                  The username {value} is not available.
               </span>
            )}
         </div>
      );
   },
);

export default UsernameSignupInput;
