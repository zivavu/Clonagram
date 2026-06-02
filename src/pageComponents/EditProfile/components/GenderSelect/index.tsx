'use client';

import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { MdCheck } from 'react-icons/md';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

const PREDEFINED_OPTIONS = ['Female', 'Male', 'Prefer not to say'] as const;

interface GenderSelectProps {
   value: string;
   onChange: (value: string) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
   const [isOpen, setIsOpen] = useState(false);
   const customInputRef = useRef<HTMLInputElement>(null);
   const isCustom = !PREDEFINED_OPTIONS.includes(value as (typeof PREDEFINED_OPTIONS)[number]);
   const customText = isCustom ? value : '';

   function handleSelect(option: string) {
      if (option !== 'Custom') {
         setIsOpen(false);
         onChange(option);
      } else if (option === 'Custom') {
         onChange('');
      }
   }

   function handleCustomTextChange(text: string) {
      onChange(text);
   }

   return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
         <Popover.Trigger asChild>
            <button type="button" {...stylex.props(styles.trigger)}>
               <span {...stylex.props(styles.triggerText)}>{value}</span>
               <IoChevronDown size={16} {...stylex.props(styles.chevron)} />
            </button>
         </Popover.Trigger>
         <Popover.Portal>
            <Popover.Content
               side="bottom"
               align="end"
               sideOffset={4}
               {...stylex.props(styles.content)}
            >
               {PREDEFINED_OPTIONS.map(option => {
                  const selected = value === option;
                  return (
                     <button
                        key={option}
                        type="button"
                        {...stylex.props(styles.option)}
                        onClick={() => handleSelect(option)}
                     >
                        <span {...stylex.props(styles.optionLabel)}>{option}</span>
                        <div {...stylex.props(styles.radio, selected && styles.radioSelected)}>
                           {selected && <MdCheck size={16} color={colors.bg} />}
                        </div>
                     </button>
                  );
               })}
               <button
                  type="button"
                  {...stylex.props(styles.option, isCustom && styles.optionActive)}
                  onClick={() => handleSelect('Custom')}
               >
                  <div {...stylex.props(styles.customColumn)}>
                     <div {...stylex.props(styles.customRow)}>
                        <span {...stylex.props(styles.optionLabel)}>Custom</span>
                        <div {...stylex.props(styles.radio, isCustom && styles.radioSelected)}>
                           {isCustom && <MdCheck size={16} color={colors.bg} />}
                        </div>
                     </div>
                     {isCustom && (
                        <input
                           {...stylex.props(styles.customInput)}
                           type="text"
                           ref={customInputRef}
                           value={customText}
                           onChange={e => handleCustomTextChange(e.target.value)}
                           onClick={e => e.stopPropagation()}
                        />
                     )}
                  </div>
               </button>
            </Popover.Content>
         </Popover.Portal>
      </Popover.Root>
   );
}
