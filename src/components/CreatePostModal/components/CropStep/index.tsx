'use client';

import * as stylex from '@stylexjs/stylex';
import type { AspectRatio, PostMedia } from '../../types';
import StepHeader, { StepHeaderAction } from '../StepHeader';
import CropControls from './components/CropControls';
import CropPreview from './components/CropPreview';
import { styles } from './index.stylex';

interface CropStepProps {
   files: PostMedia[];
   currentIndex: number;
   onBack: () => void;
   onNext: () => void;
   onSelectIndex: (index: number) => void;
   onRemoveFile: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
   onReorderFiles: (fromIndex: number, toIndex: number) => void;
   onAddFiles: () => void;
   aspectRatio: AspectRatio;
   onAspectRatioChange: (ratio: AspectRatio) => void;
}

export default function CropStep({
   files,
   currentIndex,
   onBack,
   onNext,
   onSelectIndex,
   onRemoveFile,
   onUpdateFile,
   onReorderFiles,
   onAddFiles,
   aspectRatio,
   onAspectRatioChange,
}: CropStepProps) {
   const currentFile = files[currentIndex];
   if (!currentFile) return null;

   return (
      <div {...stylex.props(styles.root)}>
         <StepHeader
            title="Crop"
            onBack={onBack}
            rightSlot={<StepHeaderAction label="Next" onClick={onNext} />}
         />
         <CropPreview
            files={files}
            currentIndex={currentIndex}
            aspectRatio={aspectRatio}
            onSelectIndex={onSelectIndex}
            onUpdateFile={onUpdateFile}
         />
         <CropControls
            files={files}
            currentIndex={currentIndex}
            aspectRatio={aspectRatio}
            onAspectRatioChange={onAspectRatioChange}
            onSelectIndex={onSelectIndex}
            onRemoveFile={onRemoveFile}
            onReorderFiles={onReorderFiles}
            onUpdateFile={onUpdateFile}
            onAddFiles={onAddFiles}
         />
      </div>
   );
}
