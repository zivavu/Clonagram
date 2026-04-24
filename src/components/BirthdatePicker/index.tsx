'use client';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

const CURRENT_YEAR = new Date().getFullYear();

const styles = stylex.create({
   wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '16px',
   },
   topLabel: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: colors.textPrimary,
   },
   container: {
      display: 'flex',
      gap: '8px',
   },
   trigger: {
      position: 'relative',
      flex: '1',
      width: '100%',
      height: '56px',
      paddingTop: '18px',
      paddingBottom: '6px',
      paddingLeft: '12px',
      paddingRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      color: colors.textPrimary,
      backgroundColor: colors.bgSecondary,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.lg,
      cursor: 'pointer',
      transition: 'border-color 0.15s ease',
      ':hover': {
         borderColor: colors.accent,
      },
   },
   triggerLabel: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '16px',
      fontWeight: '400',
      color: colors.textSecondary,
      pointerEvents: 'none',
      transition: 'top 0.15s ease, font-size 0.15s ease, transform 0.15s ease',
   },
   triggerLabelFloated: {
      top: '6px',
      transform: 'translateY(0)',
      fontSize: '12px',
   },
   content: {
      backgroundColor: colors.bgElevated,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: '4px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 50,
      minWidth: 'var(--radix-dropdown-menu-trigger-width)',
   },
   item: {
      padding: '8px 12px',
      fontSize: '14px',
      color: colors.textPrimary,
      borderRadius: radius.sm,
      cursor: 'pointer',
      outline: 'none',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
});

export interface BirthdateValue {
   month: number | null;
   day: number | null;
   year: number | null;
}

export interface BirthdatePickerProps {
   topLabel?: string;
   value?: BirthdateValue;
   defaultValue?: BirthdateValue;
   onChange?: (value: BirthdateValue) => void;
   yearRange?: number;
}

export default function BirthdatePicker({
   topLabel = 'Birthdate',
   value,
   defaultValue,
   onChange,
   yearRange = 100,
}: BirthdatePickerProps) {
   const isControlled = value !== undefined;

   const [internalValue, setInternalValue] = useState<BirthdateValue>(
      defaultValue ?? { month: null, day: null, year: null },
   );

   const current = isControlled ? value : internalValue;

   const update = (patch: Partial<BirthdateValue>) => {
      const next = { ...current, ...patch };
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
   };

   return (
      <div {...stylex.props(styles.wrapper)}>
         <label {...stylex.props(styles.topLabel)}>{topLabel}</label>
         <div {...stylex.props(styles.container)}>
            <DropdownMenu>
               <DropdownMenuTrigger {...stylex.props(styles.trigger)}>
                  <span {...stylex.props(styles.triggerLabel, current.month !== null && styles.triggerLabelFloated)}>
                     Month
                  </span>
                  {current.month !== null && <span>{current.month}</span>}
                  <ChevronDown size={16} color="var(--colors-textSecondary)" />
               </DropdownMenuTrigger>
               <DropdownMenuContent {...stylex.props(styles.content)}>
                  {Array.from({ length: 12 }, (_, i) => (
                     <DropdownMenuItem key={i} {...stylex.props(styles.item)} onSelect={() => update({ month: i + 1 })}>
                        {i + 1}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
               <DropdownMenuTrigger {...stylex.props(styles.trigger)}>
                  <span {...stylex.props(styles.triggerLabel, current.day !== null && styles.triggerLabelFloated)}>
                     Day
                  </span>
                  {current.day !== null && <span>{current.day}</span>}
                  <ChevronDown size={16} color="var(--colors-textSecondary)" />
               </DropdownMenuTrigger>
               <DropdownMenuContent {...stylex.props(styles.content)}>
                  {Array.from({ length: 31 }, (_, i) => (
                     <DropdownMenuItem key={i} {...stylex.props(styles.item)} onSelect={() => update({ day: i + 1 })}>
                        {i + 1}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
               <DropdownMenuTrigger {...stylex.props(styles.trigger)}>
                  <span {...stylex.props(styles.triggerLabel, current.year !== null && styles.triggerLabelFloated)}>
                     Year
                  </span>
                  {current.year !== null && <span>{current.year}</span>}
                  <ChevronDown size={16} color="var(--colors-textSecondary)" />
               </DropdownMenuTrigger>
               <DropdownMenuContent {...stylex.props(styles.content)}>
                  {Array.from({ length: yearRange }, (_, i) => (
                     <DropdownMenuItem
                        key={i}
                        {...stylex.props(styles.item)}
                        onSelect={() => update({ year: CURRENT_YEAR - i })}
                     >
                        {CURRENT_YEAR - i}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
}
