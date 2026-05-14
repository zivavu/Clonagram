'use client';

import * as stylex from '@stylexjs/stylex';
import type { PartialUser } from '@/src/types/global';
import type { AspectRatio, PostLocation, PostMedia, PostSettings } from '../../types';
import StepHeader, { StepHeaderAction } from '../StepHeader';
import CaptionPanel from './components/CaptionPanel';
import CaptionPreview from './components/CaptionPreview';
import { styles } from './index.stylex';

interface CaptionStepProps {
   files: PostMedia[];
   currentIndex: number;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
   onBack: () => void;
   onShare: () => void;
   aspectRatio: AspectRatio;
   caption: string;
   onCaptionChange: (caption: string) => void;
   location: PostLocation | null;
   onLocationChange: (location: PostLocation | null) => void;
   collaborators: PartialUser[];
   onCollaboratorsChange: (collaborators: PartialUser[]) => void;
   postSettings: PostSettings;
   onPostSettingsChange: (settings: PostSettings) => void;
}

export default function CaptionStep({
   files,
   currentIndex,
   onSelectIndex,
   onUpdateFile,
   onBack,
   onShare,
   aspectRatio,
   caption,
   onCaptionChange,
   location,
   onLocationChange,
   collaborators,
   onCollaboratorsChange,
   postSettings,
   onPostSettingsChange,
}: CaptionStepProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <StepHeader
            title="Create new post"
            onBack={onBack}
            rightSlot={<StepHeaderAction label="Share" onClick={onShare} />}
         />
         <div {...stylex.props(styles.body)}>
            <CaptionPreview
               files={files}
               currentIndex={currentIndex}
               aspectRatio={aspectRatio}
               onSelectIndex={onSelectIndex}
               onUpdateFile={onUpdateFile}
            />
            <CaptionPanel
               caption={caption}
               onCaptionChange={onCaptionChange}
               location={location}
               onLocationChange={onLocationChange}
               collaborators={collaborators}
               onCollaboratorsChange={onCollaboratorsChange}
               postSettings={postSettings}
               onPostSettingsChange={onPostSettingsChange}
               files={files}
            />
         </div>
      </div>
   );
}
