'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { IoCloseOutline } from 'react-icons/io5';
import { colors, radius } from '../../../../styles/tokens.stylex';
import { useUploadPost } from '../../hooks/useUploadPost';
import type { PostData } from '../../types';
import { shared } from '../Spinner.stylex';
import StepHeader from '../StepHeader';

const spin = stylex.keyframes({
   from: { transform: 'rotate(0deg)' },
   to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
   spinningRing: {
      animationName: spin,
      animationDuration: '0.5s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
   },
   closeButton: {
      display: 'flex',
      color: colors.textPrimary,
      borderRadius: radius.full,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
});

interface SharingStepProps {
   postData: PostData;
   onDone: () => void;
}

export default function SharingStep({ postData, onDone }: SharingStepProps) {
   useUploadPost({ postData, onDone });

   return (
      <div {...stylex.props(shared.root)}>
         <StepHeader
            title="Sharing"
            rightSlot={
               <Dialog.Close asChild>
                  <button {...stylex.props(styles.closeButton)} aria-label="Close">
                     <IoCloseOutline style={{ fontSize: 30 }} />
                  </button>
               </Dialog.Close>
            }
         />
         <div {...stylex.props(shared.body)}>
            <div {...stylex.props(shared.ring, styles.spinningRing)}>
               <div {...stylex.props(shared.ringInner)} />
            </div>
         </div>
      </div>
   );
}
