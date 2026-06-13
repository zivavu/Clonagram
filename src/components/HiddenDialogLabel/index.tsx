import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function HiddenDialogTitle({ children }: { children: React.ReactNode }) {
   return (
      <VisuallyHidden asChild>
         <Dialog.Title>{children}</Dialog.Title>
      </VisuallyHidden>
   );
}

export function HiddenDialogDescription({ children }: { children: React.ReactNode }) {
   return (
      <VisuallyHidden asChild>
         <Dialog.Description>{children}</Dialog.Description>
      </VisuallyHidden>
   );
}
