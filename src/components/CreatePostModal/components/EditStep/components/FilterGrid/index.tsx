import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from './index.stylex';

export interface FilterPreset {
   name: string;
}

interface FilterGridProps {
   presets: FilterPreset[];
   selectedPreset: string;
   thumbnails: Record<string, string>;
   onSelect: (name: string) => void;
}

export default function FilterGrid({
   presets,
   selectedPreset,
   thumbnails,
   onSelect,
}: FilterGridProps) {
   return (
      <div {...stylex.props(styles.grid)}>
         {presets.map(preset => {
            const isActive = selectedPreset === preset.name;
            const thumbSrc = thumbnails[preset.name];
            return (
               <button
                  key={preset.name}
                  type="button"
                  {...stylex.props(styles.thumbButton)}
                  onClick={() => onSelect(preset.name)}
               >
                  <div {...stylex.props(styles.imageWrap, isActive && styles.imageWrapActive)}>
                     {thumbSrc ? (
                        <Image
                           src={thumbSrc}
                           alt={preset.name}
                           fill
                           style={{ objectFit: 'cover' }}
                           sizes="88px"
                        />
                     ) : (
                        <div {...stylex.props(styles.placeholder)} />
                     )}
                  </div>
                  <span {...stylex.props(styles.name, isActive && styles.nameActive)}>
                     {preset.name}
                  </span>
               </button>
            );
         })}
      </div>
   );
}
