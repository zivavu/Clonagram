'use client';

import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { MdVolumeDown, MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { styles } from './index.stylex';

interface VolumeControlProps {
   side?: 'top' | 'bottom' | 'left' | 'right';
   align?: 'start' | 'center' | 'end';
   vertical?: boolean;
}

export default function VolumeControl({ side, align, vertical }: VolumeControlProps) {
   const { volume, setVolume } = usePlayerStore();
   const [open, setOpen] = useState(false);

   return (
      <Popover.Root open={open} onOpenChange={setOpen}>
         <Popover.Trigger asChild>
            <button
               type="button"
               onClick={e => e.stopPropagation()}
               {...stylex.props(styles.button)}
            >
               {volume === 0 ? (
                  <MdVolumeOff size={20} />
               ) : volume < 0.5 ? (
                  <MdVolumeDown size={20} />
               ) : (
                  <MdVolumeUp size={20} />
               )}
            </button>
         </Popover.Trigger>
         <Popover.Portal>
            <Popover.Content
               side={side ?? 'bottom'}
               align={align ?? 'center'}
               sideOffset={4}
               {...stylex.props(styles.paper, vertical && styles.verticalPaper)}
            >
               <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  {...stylex.props(styles.slider, vertical && styles.verticalSlider)}
               />
            </Popover.Content>
         </Popover.Portal>
      </Popover.Root>
   );
}
