'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface DialogOverlayProps {
   zIndex?: number;
}

export default function DialogOverlay({ zIndex }: DialogOverlayProps) {
   return (
      <Dialog.Overlay
         {...stylex.props(styles.overlay)}
         style={zIndex !== undefined ? { zIndex } : undefined}
      />
   );
}
