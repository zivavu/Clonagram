import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface DiscardDialogProps {
   onCancel: () => void;
   onConfirm: () => void;
}

export default function DiscardDialog({ onCancel, onConfirm }: DiscardDialogProps) {
   return (
      <>
         <button
            type="button"
            aria-label="Close confirmation"
            {...stylex.props(styles.overlay)}
            onClick={onCancel}
         />
         <div {...stylex.props(styles.card)}>
            <h3 {...stylex.props(styles.title)}>Discard post?</h3>
            <p {...stylex.props(styles.subtitle)}>If you leave, your edits won't be saved.</p>
            <button
               type="button"
               {...stylex.props(styles.button, styles.danger)}
               onClick={onConfirm}
            >
               Discard
            </button>
            <button type="button" {...stylex.props(styles.button)} onClick={onCancel}>
               Cancel
            </button>
         </div>
      </>
   );
}
