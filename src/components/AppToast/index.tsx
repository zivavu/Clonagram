'use client';

import * as Toast from '@radix-ui/react-toast';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { styles } from './index.stylex';

type ShowFn = (message: string) => void;
let _show: ShowFn | null = null;

export function toast(message: string) {
   _show?.(message);
}

export default function AppToast() {
   const [open, setOpen] = useState(false);
   const [message, setMessage] = useState('');

   useEffect(() => {
      _show = (msg: string) => {
         setMessage(msg);
         setOpen(true);
      };
      return () => {
         _show = null;
      };
   }, []);

   return (
      <>
         <Toast.Root
            open={open}
            onOpenChange={setOpen}
            duration={3000}
            {...stylex.props(styles.root)}
         >
            <Toast.Description {...stylex.props(styles.description)}>{message}</Toast.Description>
         </Toast.Root>
         <Toast.Viewport {...stylex.props(styles.viewport)} />
      </>
   );
}
