'use client';
import * as stylex from '@stylexjs/stylex';
import { type InputHTMLAttributes, useState } from 'react';
import { styles } from './index.stylex';

export interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
   label: string;
}

export default function FloatingInput({ label, onChange, ...props }: FloatingInputProps) {
   const [isFocused, setIsFocused] = useState(false);
   const [hasValue, setHasValue] = useState(false);

   const floated = isFocused || hasValue;

   return (
      <div {...stylex.props(styles.wrapper)}>
         <input
            {...stylex.props(styles.input, isFocused && styles.inputFocused)}
            {...props}
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
            {...stylex.props(styles.label, floated && styles.labelFloated, isFocused && styles.labelFocused)}
         >
            {label}
         </label>
      </div>
   );
}
