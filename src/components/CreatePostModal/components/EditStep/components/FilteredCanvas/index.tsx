import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { useWebGLFilter } from '../../../../hooks/useWebGLFilter';
import type { Adjustments } from '../../../../types';
import { styles } from './index.stylex';

interface FilteredCanvasProps {
   src: string;
   width: number;
   height: number;
   adjustments: Adjustments;
   filterPreset: string;
   filterStrength: number;
   style: React.CSSProperties;
}

export default function FilteredCanvas({
   src,
   width,
   height,
   adjustments,
   filterPreset,
   filterStrength,
   style,
}: FilteredCanvasProps) {
   const [showOriginal, setShowOriginal] = useState(false);

   const effectiveAdjustments = showOriginal
      ? { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 }
      : adjustments;
   const effectivePreset = showOriginal ? 'Original' : filterPreset;
   const effectiveStrength = showOriginal ? 0 : filterStrength;

   const { canvasRef } = useWebGLFilter({
      src,
      width,
      height,
      adjustments: effectiveAdjustments,
      filterPreset: effectivePreset,
      filterStrength: effectiveStrength,
   });

   return (
      <canvas
         ref={canvasRef}
         draggable={false}
         {...stylex.props(styles.previewImage)}
         style={style}
         onPointerDown={e => {
            const el = e.currentTarget;
            el.setPointerCapture(e.pointerId);
            setShowOriginal(true);
         }}
         onPointerUp={e => {
            const el = e.currentTarget;
            el.releasePointerCapture(e.pointerId);
            setShowOriginal(false);
         }}
         onPointerCancel={() => setShowOriginal(false)}
      />
   );
}
