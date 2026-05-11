'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import type { TaggedPerson } from '../../../../types';
import { styles } from './index.stylex';

interface TagPinProps {
   tag: TaggedPerson;
   onRemove: () => void;
   onMove: (x: number, y: number) => void;
}

export default function TagPin({ tag, onRemove, onMove }: TagPinProps) {
   const pinRef = useRef<HTMLDivElement>(null);

   function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
      e.stopPropagation();
      const pin = pinRef.current;
      if (!pin) return;
      const container = pin.parentElement;
      if (!container) return;

      pin.setPointerCapture(e.pointerId);

      function handlePointerMove(moveEvent: PointerEvent) {
         const rect = container!.getBoundingClientRect();
         const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
         const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
         onMove(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
      }

      function handlePointerUp() {
         pin!.removeEventListener('pointermove', handlePointerMove);
         pin!.removeEventListener('pointerup', handlePointerUp);
      }

      pin.addEventListener('pointermove', handlePointerMove);
      pin.addEventListener('pointerup', handlePointerUp);
   }

   return (
      <div
         ref={pinRef}
         {...stylex.props(styles.pin)}
         style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
         onPointerDown={handlePointerDown}
      >
         <div {...stylex.props(styles.triangle)} />
         <div {...stylex.props(styles.label)}>
            <span>{tag.user.username}</span>
            <button
               type="button"
               {...stylex.props(styles.removeBtn)}
               onClick={e => {
                  e.stopPropagation();
                  onRemove();
               }}
            >
               <IoClose {...stylex.props(styles.removeBtnIcon)} />
            </button>
         </div>
      </div>
   );
}
