'use client';
import * as stylex from '@stylexjs/stylex';
import { forwardRef, type InputHTMLAttributes, useEffect, useId, useRef, useState } from 'react';
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
   const generatedId = useId();
   const inputId = props.id ?? generatedId;

   const [isFocused, setIsFocused] = useState(false);
   const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

   const innerRef = useRef<HTMLInputElement | null>(null);
   const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
   };

   // Chrome may autofill on page load *before* React attaches onAnimationStart,
   // so the autofill animation event is missed. Poll the input for a short
   // window after mount to catch a value that's already been filled.
   useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const check = () => {
         let autofilled = false;
         try {
            autofilled = el.matches(':-webkit-autofill') || el.matches(':autofill');
         } catch {
            // pseudo-class unsupported in this browser
         }
         if (autofilled || el.value.length > 0) setHasValue(true);
      };
      check();
      const timer = setTimeout(check, 120);
      return () => clearTimeout(timer);
   }, []);

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
            ref={setRefs}
            id={inputId}
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
            onAnimationStart={e => {
               // The only animation on this input is the autofill detector.
               setHasValue(true);
               props.onAnimationStart?.(e);
            }}
         />
         <label
            htmlFor={inputId}
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
