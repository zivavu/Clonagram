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
   errorText: {
      color: colors.textPrimary,
      fontSize: 14,
      textAlign: 'center',
      padding: '0 24px',
      maxWidth: 320,
   },
   retryButton: {
      marginTop: 16,
      padding: '8px 24px',
      borderRadius: radius.md,
      backgroundColor: colors.textPrimary,
      color: colors.bg,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
   },
});

interface SharingStepProps {
   postData: PostData;
   onDone: () => void;
}

export default function SharingStep({ postData, onDone }: SharingStepProps) {
   const { status, error } = useUploadPost({ postData, onDone });

   const isError = status === 'error';

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
            {isError ? (
               <>
                  <span {...stylex.props(styles.errorText)}>
                     {error ?? 'Something went wrong while sharing your post.'}
                  </span>
                  <button type="button" {...stylex.props(styles.retryButton)} onClick={onDone}>
                     Try again
                  </button>
               </>
            ) : (
               <div {...stylex.props(shared.ring, styles.spinningRing)}>
                  <div {...stylex.props(shared.ringInner)} />
               </div>
            )}
         </div>
      </div>
   );
}
