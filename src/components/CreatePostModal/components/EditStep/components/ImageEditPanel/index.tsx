import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { useFilterThumbnails } from '../../../../hooks/useFilterThumbnails';
import { type Adjustments, DEFAULT_ADJUSTMENTS, type PostMedia } from '../../../../types';
import StyledSlider from '../../../StyledSlider';
import AdjustmentSliders from '../AdjustmentSliders';
import type { FilterPreset } from '../FilterGrid';
import FilterGrid from '../FilterGrid';
import { styles } from './index.stylex';

const FILTER_PRESETS: FilterPreset[] = [
   { name: 'Aden' },
   { name: 'Clarendon' },
   { name: 'Crema' },
   { name: 'Gingham' },
   { name: 'Juno' },
   { name: 'Lark' },
   { name: 'Ludwig' },
   { name: 'Moon' },
   { name: 'Original' },
   { name: 'Perpetua' },
   { name: 'Reyes' },
   { name: 'Slumber' },
];

const FILTER_PRESET_NAMES = FILTER_PRESETS.map(p => p.name);

interface ImageEditPanelProps {
   file: PostMedia;
   onUpdate: (updates: Partial<PostMedia>) => void;
}

export default function ImageEditPanel({ file, onUpdate }: ImageEditPanelProps) {
   const [activeTab, setActiveTab] = useState<'filters' | 'adjustments'>('filters');
   const thumbnails = useFilterThumbnails(file.preview, FILTER_PRESET_NAMES);

   const handlePresetChange = (name: string) => {
      onUpdate({
         filterPreset: name,
         filterStrength: 100,
         adjustments: { ...DEFAULT_ADJUSTMENTS },
      });
   };

   const handleAdjustmentChange = (key: keyof Adjustments, value: number) => {
      onUpdate({ adjustments: { ...file.adjustments, [key]: value } });
   };

   return (
      <>
         <div {...stylex.props(styles.tabs)}>
            <button
               type="button"
               {...stylex.props(styles.tab, activeTab !== 'filters' && styles.tabInactive)}
               onClick={() => setActiveTab('filters')}
            >
               Filters
            </button>
            <button
               type="button"
               {...stylex.props(styles.tab, activeTab !== 'adjustments' && styles.tabInactive)}
               onClick={() => setActiveTab('adjustments')}
            >
               Adjustments
            </button>
         </div>

         {activeTab === 'filters' && (
            <>
               <FilterGrid
                  presets={FILTER_PRESETS}
                  selectedPreset={file.filterPreset}
                  thumbnails={thumbnails}
                  onSelect={handlePresetChange}
               />
               {file.filterPreset !== 'Original' && (
                  <div {...stylex.props(styles.strengthRow)}>
                     <StyledSlider
                        min={0}
                        max={100}
                        value={file.filterStrength}
                        onChange={value => onUpdate({ filterStrength: value })}
                     />
                  </div>
               )}
            </>
         )}

         {activeTab === 'adjustments' && (
            <AdjustmentSliders adjustments={file.adjustments} onChange={handleAdjustmentChange} />
         )}
      </>
   );
}
