import * as stylex from '@stylexjs/stylex';
import type { Adjustments } from '../../../../types';
import StyledSlider from '../../../StyledSlider';
import { styles } from './index.stylex';

interface AdjustmentDef {
   key: keyof Adjustments;
   label: string;
   min: number;
   max: number;
}

const DEFINITIONS: AdjustmentDef[] = [
   { key: 'brightness', label: 'Brightness', min: -50, max: 50 },
   { key: 'contrast', label: 'Contrast', min: -50, max: 50 },
   { key: 'fade', label: 'Fade', min: -100, max: 100 },
   { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
   { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
   { key: 'vignette', label: 'Vignette', min: 0, max: 100 },
];

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
               <StyledSlider
                  min={min}
                  max={max}
                  value={adjustments[key]}
                  onChange={value => onChange(key, value)}
               />
            </div>
         ))}
      </div>
   );
}
