import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

export function sliderGradient(min: number, max: number, value: number): string {
   const percent = ((value - min) / (max - min)) * 100;
   if (min < 0) {
      return `linear-gradient(to right, rgb(0,0,0) 0%, rgb(0,0,0) ${percent}%, rgb(255,255,255) ${percent}%, rgb(255,255,255) ${percent}%, rgb(0,0,0) ${percent}%, rgb(0,0,0) 100%)`;
   }
   return `linear-gradient(to right, rgb(255,255,255) 0%, rgb(255,255,255) ${percent}%, rgb(0,0,0) ${percent}%, rgb(0,0,0) 100%)`;
}

interface StyledSliderProps {
   min: number;
   max: number;
   step?: number;
   value: number;
   onChange: (value: number) => void;
   showValue?: boolean;
}

export default function StyledSlider({
   min,
   max,
   step,
   value,
   onChange,
   showValue = true,
}: StyledSliderProps) {
   return (
      <div {...stylex.props(styles.row)}>
         <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            {...stylex.props(styles.slider)}
            style={{ background: sliderGradient(min, max, value) }}
         />
         {showValue && <span {...stylex.props(styles.value)}>{value}</span>}
      </div>
   );
}
