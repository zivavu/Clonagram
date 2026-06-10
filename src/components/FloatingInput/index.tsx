'use client';
import * as stylex from '@stylexjs/stylex';
import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { styles } from './index.stylex';

export interface FloatingInputProps
   extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
   label: string;
   endAdornment?: React.ReactNode;
   borderState?: 'error' | 'success';
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(function FloatingInput(
   { label, onChange, endAdornment, borderState, ...props },
   ref,
) {
   const [isFocused, setIsFocused] = useState(false);
   const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

   const floated = isFocused || hasValue;

   return (
      <div {...stylex.props(styles.wrapper)}>
         <input
            {...stylex.props(
               styles.input,
               isFocused && styles.inputFocused,
               !!endAdornment && styles.inputWithAdornment,
               borderState === 'error' && styles.inputError,
               borderState === 'success' && styles.inputSuccess,
            )}
            {...props}
            ref={ref}
            id={props.id}
            onFocus={e => {
               setIsFocused(true);
               props.onFocus?.(e);
            }}
            onBlur={e => {
               setIsFocused(false);
               props.onBlur?.(e);
            }}
            onChange={e => {
               setHasValue(e.target.value.length > 0);
               onChange?.(e);
            }}
         />
         <label
            htmlFor={props.id}
            {...stylex.props(
               styles.label,
               floated && styles.labelFloated,
               isFocused && styles.labelFocused,
               borderState === 'error' && styles.labelError,
            )}
         >
            {label}
         </label>
         {endAdornment && <div {...stylex.props(styles.adornment)}>{endAdornment}</div>}
      </div>
   );
});

export default FloatingInput;
