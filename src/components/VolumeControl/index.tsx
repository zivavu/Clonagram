'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { MdVolumeDown, MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { styles } from './index.stylex';

interface VolumeControlProps {
   side?: 'top' | 'bottom';
   style?: StyleXStyles;
}

export default function VolumeControl({ side = 'bottom', style }: VolumeControlProps) {
   const { volume, setVolume, mute, unmute } = usePlayerStore();
   const [open, setOpen] = useState(false);

   return (
      <div
         role="group"
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}
         {...stylex.props(styles.container, open && styles.containerOpen, style)}
      >
         <div
            {...stylex.props(
               styles.sliderWrapper,
               side === 'top' && styles.sliderWrapperTop,
               side !== 'top' && styles.sliderWrapperBottom,
               open && styles.sliderWrapperOpen,
               open && styles.sliderWrapperOpenHeight,
            )}
         >
            <input
               type="range"
               min="0"
               max="1"
               step="0.01"
               value={volume}
               onChange={e => setVolume(Number(e.target.value))}
               onClick={e => e.stopPropagation()}
               {...stylex.props(
                  styles.slider,
                  side === 'top' && styles.sliderTop,
                  side !== 'top' && styles.sliderBottom,
               )}
            />
         </div>
         <button
            type="button"
            onClick={e => {
               e.stopPropagation();
               volume === 0 ? unmute() : mute();
            }}
            {...stylex.props(styles.button, open && styles.buttonOpen)}
         >
            {volume === 0 ? (
               <MdVolumeOff size={20} />
            ) : volume < 0.5 ? (
               <MdVolumeDown size={20} />
            ) : (
               <MdVolumeUp size={20} />
            )}
         </button>
      </div>
   );
}
