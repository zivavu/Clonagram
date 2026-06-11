import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { IoCloseOutline, IoImagesOutline } from 'react-icons/io5';
import StepHeader from '../StepHeader';
import { stepHeaderStyles, styles } from './index.stylex';

interface UploadStepProps {
   getRootProps: () => Record<string, unknown>;
   open: () => void;
   isDragActive: boolean;
   elementType: 'post' | 'story' | 'reel';
}

export default function UploadStep({
   getRootProps,
   open,
   isDragActive,
   elementType,
}: UploadStepProps) {
   const textContent = {
      reel: {
         title: 'Create new reel',
         description: 'Upload a video to create a new reel',
         dropzoneText: 'Drop your video here',
         button: 'Select video',
      },
      post: {
         title: 'Create new post',
         description: 'Upload photos and videos to create a new post',
         dropzoneText: 'Drop your photos and videos here',
         button: 'Select from computer',
      },
      story: {
         title: 'Create new story',
         description: 'Upload photos and videos to create a new story',
         dropzoneText: 'Drop your photo or video',
         button: 'Select from computer',
      },
   } as const;
   return (
      <>
         <Dialog.Description style={{ display: 'none' }}>
            {textContent[elementType].description}
         </Dialog.Description>
         <StepHeader
            title={<Dialog.Title>{textContent[elementType].title}</Dialog.Title>}
            rightSlot={
               <Dialog.Close asChild>
                  <button {...stylex.props(stepHeaderStyles.closeButton)} aria-label="Close">
                     <IoCloseOutline size={30} />
                  </button>
               </Dialog.Close>
            }
         />
         <div
            {...getRootProps()}
            {...stylex.props(styles.dropZone, isDragActive && styles.dropZoneActive)}
         >
            <IoImagesOutline size={96} style={{ color: 'rgb(168, 168, 168)' }} />
            <p {...stylex.props(styles.dropText)}>{textContent[elementType].dropzoneText}</p>
            <button type="button" {...stylex.props(styles.selectButton)} onClick={open}>
               {textContent[elementType].button}
            </button>
         </div>
      </>
   );
}
