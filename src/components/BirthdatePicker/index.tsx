'use client';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import * as stylex from '@stylexjs/stylex';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { colors, radius } from '../../styles/tokens.stylex';

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
      fontSize: '16px',
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
      padding: '1px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 50,
      minWidth: 'var(--radix-dropdown-menu-trigger-width)',
   },
   item: {
      padding: '12px',
      fontSize: '16px',
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
   value: BirthdateValue;
   onChange: (value: BirthdateValue) => void;
}

export default function BirthdatePicker({ topLabel = 'Birthdate', value, onChange }: BirthdatePickerProps) {
   const update = (patch: Partial<BirthdateValue>) => onChange({ ...value, ...patch });

   const currentYear = new Date().getFullYear();

   const monthLength = new Date(value.year ?? new Date().getFullYear(), value.month ?? 1, 0).getDate();

   const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Date(currentYear, i, 1).toLocaleString('en-US', {
         month: 'long',
      }),
   );
   const BirthdateParts = [
      {
         label: 'Month',
         value: value.month,
         onChange: (value: number) => update({ month: value }),
         options: Array.from({ length: 12 }, (_, i) => i + 1),
      },
      {
         label: 'Day',
         value: value.day,
         onChange: (value: number) => update({ day: value }),
         options: Array.from({ length: monthLength }, (_, i) => i + 1),
      },
      {
         label: 'Year',
         value: value.year,
         onChange: (value: number) => update({ year: value }),
         options: Array.from({ length: 100 }, (_, i) => currentYear - i),
      },
   ] as const;

   return (
      <div {...stylex.props(styles.wrapper)}>
         <label {...stylex.props(styles.topLabel)}>{topLabel}</label>
         <div {...stylex.props(styles.container)}>
            {BirthdateParts.map(part => (
               <DropdownMenu key={part.label}>
                  <DropdownMenuTrigger {...stylex.props(styles.trigger)}>
                     <span {...stylex.props(styles.triggerLabel, part.value !== null && styles.triggerLabelFloated)}>
                        {part.label}
                     </span>
                     {part.value !== null && (
                        <span>{part.label === 'Month' ? monthNames[part.value - 1] : part.value}</span>
                     )}
                     <KeyboardArrowDownRounded style={{ fontSize: 16, color: 'var(--colors-textSecondary)' }} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent {...stylex.props(styles.content)}>
                     {part.options.map(option => (
                        <DropdownMenuItem
                           key={option.toString()}
                           {...stylex.props(styles.item)}
                           onSelect={() => part.onChange(option)}
                        >
                           {part.label === 'Month' ? monthNames[option - 1] : option.toString()}
                        </DropdownMenuItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            ))}
         </div>
      </div>
   );
}
