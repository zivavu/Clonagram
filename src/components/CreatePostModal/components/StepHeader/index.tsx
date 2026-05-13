import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { styles } from './index.stylex';

interface StepHeaderProps {
   title: ReactNode;
   onBack?: () => void;
   leftSlot?: ReactNode;
   rightSlot?: ReactNode;
}

export default function StepHeader({ title, onBack, leftSlot, rightSlot }: StepHeaderProps) {
   const left =
      leftSlot ??
      (onBack ? (
         <button
            type="button"
            {...stylex.props(styles.iconButton)}
            onClick={onBack}
            aria-label="Back"
         >
            <IoArrowBack style={{ fontSize: 24 }} />
         </button>
      ) : (
         <div {...stylex.props(styles.spacer)} />
      ));

   return (
      <div {...stylex.props(styles.header)}>
         {left}
         <span {...stylex.props(styles.title)}>{title}</span>
         {rightSlot ?? <div {...stylex.props(styles.spacer)} />}
      </div>
   );
}

interface ActionButtonProps {
   label: string;
   onClick: () => void;
}

export function StepHeaderAction({ label, onClick }: ActionButtonProps) {
   return (
      <button type="button" {...stylex.props(styles.actionButton)} onClick={onClick}>
         {label}
      </button>
   );
}
