'use client';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import * as stylex from '@stylexjs/stylex';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { styles } from './index.stylex';

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
         <span {...stylex.props(styles.topLabel)}>{topLabel}</span>
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
                     <MdKeyboardArrowDown style={{ fontSize: 16, color: 'var(--colors-textSecondary)' }} />
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
