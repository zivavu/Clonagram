import * as stylex from '@stylexjs/stylex';
import type { Adjustments } from '../../../../types';
import { styles } from './index.stylex';

interface AdjustmentDef {
   key: keyof Adjustments;
   label: string;
   min: number;
   max: number;
}

const DEFINITIONS: AdjustmentDef[] = [
   { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
   { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
   { key: 'fade', label: 'Fade', min: 0, max: 100 },
   { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
   { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
   { key: 'vignette', label: 'Vignette', min: 0, max: 100 },
];

function getSliderGradient(min: number, max: number, value: number): string {
   const percent = ((value - min) / (max - min)) * 100;
   if (min < 0) {
      return `linear-gradient(to right, rgb(0,0,0) 0%, rgb(0,0,0) ${percent}%, rgb(255,255,255) ${percent}%, rgb(255,255,255) ${percent}%, rgb(0,0,0) ${percent}%, rgb(0,0,0) 100%)`;
   }
   return `linear-gradient(to right, rgb(255,255,255) 0%, rgb(255,255,255) ${percent}%, rgb(0,0,0) ${percent}%, rgb(0,0,0) 100%)`;
}

interface AdjustmentSlidersProps {
   adjustments: Adjustments;
   onChange: (key: keyof Adjustments, value: number) => void;
}

export default function AdjustmentSliders({ adjustments, onChange }: AdjustmentSlidersProps) {
   return (
      <div {...stylex.props(styles.list)}>
         {DEFINITIONS.map(({ key, label, min, max }) => (
            <div key={key} {...stylex.props(styles.row)}>
               <span {...stylex.props(styles.label)}>{label}</span>
               <div {...stylex.props(styles.sliderRow)}>
                  <input
                     type="range"
                     min={min}
                     max={max}
                     value={adjustments[key]}
                     onChange={e => onChange(key, Number(e.target.value))}
                     {...stylex.props(styles.slider)}
                     style={{
                        background: getSliderGradient(min, max, adjustments[key]),
                     }}
                  />
                  <span {...stylex.props(styles.value)}>{adjustments[key]}</span>
               </div>
            </div>
         ))}
      </div>
   );
}
