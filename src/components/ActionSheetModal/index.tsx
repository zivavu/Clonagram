'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { Fragment } from 'react';
import { HiddenDialogDescription, HiddenDialogTitle } from '@/src/components/HiddenDialogLabel';
import DialogOverlay from '../DialogOverlay';
import { styles } from './index.stylex';

export interface ActionSheetAction {
   label: string;
   onSelect: () => void | Promise<void>;
   isDanger?: boolean;
}

interface ActionSheetModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   title: string;
   description: string;
   actions: ActionSheetAction[];
   showHeader?: boolean;
   isLoading?: boolean;
   overlayZIndex?: number;
   isModal?: boolean;
}

export default function ActionSheetModal({
   open,
   onOpenChange,
   title,
   description,
   actions,
   showHeader = true,
   isLoading = false,
   overlayZIndex,
   isModal = true,
}: ActionSheetModalProps) {
   return (
      <Dialog.Root open={open} onOpenChange={onOpenChange} modal={isModal}>
         <Dialog.Portal>
            <DialogOverlay zIndex={overlayZIndex} />
            <Dialog.Content {...stylex.props(styles.content)}>
               {showHeader ? (
                  <>
                     <div {...stylex.props(styles.header)}>
                        <Dialog.Title {...stylex.props(styles.title)}>{title}</Dialog.Title>
                        <Dialog.Description {...stylex.props(styles.description)}>
                           {description}
                        </Dialog.Description>
                     </div>
                     <Separator orientation="horizontal" {...stylex.props(styles.separator)} />
                  </>
               ) : (
                  <>
                     <HiddenDialogTitle>{title}</HiddenDialogTitle>
                     <HiddenDialogDescription>{description}</HiddenDialogDescription>
                  </>
               )}

               {actions.map((action, index) => (
                  <Fragment key={action.label}>
                     {index > 0 && (
                        <Separator orientation="horizontal" {...stylex.props(styles.separator)} />
                     )}
                     <button
                        type="button"
                        disabled={isLoading}
                        onClick={action.onSelect}
                        {...stylex.props(
                           styles.actionButton,
                           action.isDanger && styles.dangerButton,
                        )}
                     >
                        {action.label}
                     </button>
                  </Fragment>
               ))}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
