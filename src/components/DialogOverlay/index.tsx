'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

export default function DialogOverlay() {
   return <Dialog.Overlay {...stylex.props(styles.overlay)} />;
}
