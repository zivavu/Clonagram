import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { IoCloseOutline, IoImagesOutline } from 'react-icons/io5';
import StepHeader from '../StepHeader';
import { stepHeaderStyles, styles } from './index.stylex';

interface UploadStepProps {
   getRootProps: () => Record<string, unknown>;
   open: () => void;
   isDragActive: boolean;
}

export default function UploadStep({ getRootProps, open, isDragActive }: UploadStepProps) {
   return (
      <>
         <Dialog.Description style={{ display: 'none' }}>
            Upload photos and videos to create a new post
         </Dialog.Description>
         <StepHeader
            title={<Dialog.Title>Create new post</Dialog.Title>}
            rightSlot={
               <Dialog.Close asChild>
                  <button {...stylex.props(stepHeaderStyles.closeButton)} aria-label="Close">
                     <IoCloseOutline style={{ fontSize: 30 }} />
                  </button>
               </Dialog.Close>
            }
         />
         <div
            {...getRootProps()}
            {...stylex.props(styles.dropZone, isDragActive && styles.dropZoneActive)}
         >
            <IoImagesOutline style={{ fontSize: 96, color: 'rgb(168, 168, 168)' }} />
            <p {...stylex.props(styles.dropText)}>Drag photos and videos here</p>
            <button type="button" {...stylex.props(styles.selectButton)} onClick={open}>
               Select from computer
            </button>
         </div>
      </>
   );
}
