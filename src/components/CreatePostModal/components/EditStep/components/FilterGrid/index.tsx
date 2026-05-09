import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from './index.stylex';

export interface FilterPreset {
   name: string;
   filter: string;
}

interface FilterGridProps {
   presets: FilterPreset[];
   selectedPreset: string;
   preview: string;
   onSelect: (name: string) => void;
}

export default function FilterGrid({ presets, selectedPreset, preview, onSelect }: FilterGridProps) {
   return (
      <div {...stylex.props(styles.grid)}>
         {presets.map(preset => {
            const isActive = selectedPreset === preset.name;
            return (
               <button
                  key={preset.name}
                  type="button"
                  {...stylex.props(styles.thumbButton)}
                  onClick={() => onSelect(preset.name)}
               >
                  <div {...stylex.props(styles.imageWrap, isActive && styles.imageWrapActive)}>
                     <Image
                        src={preview}
                        alt={preset.name}
                        fill
                        style={{ filter: preset.filter, objectFit: 'cover' }}
                        sizes="88px"
                     />
                  </div>
                  <span {...stylex.props(styles.name, isActive && styles.nameActive)}>{preset.name}</span>
               </button>
            );
         })}
      </div>
   );
}
