'use client';

import * as Toast from '@radix-ui/react-toast';
import * as stylex from '@stylexjs/stylex';
import { useToastStore } from '@/src/store/useToastStore';
import { styles } from './index.stylex';

export function toast(message: string) {
   useToastStore.getState().show(message);
}

export default function AppToast() {
   const { open, message, hide } = useToastStore();

   return (
      <>
         <Toast.Root open={open} onOpenChange={hide} duration={3000} {...stylex.props(styles.root)}>
            <Toast.Description {...stylex.props(styles.description)}>{message}</Toast.Description>
         </Toast.Root>
         <Toast.Viewport {...stylex.props(styles.viewport)} />
      </>
   );
}
