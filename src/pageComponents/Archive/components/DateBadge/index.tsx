import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

export default function DateBadge({ isoDate }: { isoDate: string }) {
   const date = new Date(isoDate);
   const day = date.toLocaleDateString('en-US', { day: 'numeric' });
   const month = date.toLocaleDateString('en-US', { month: 'short' });
   const showYear = date.getFullYear() !== new Date().getFullYear();

   return (
      <div {...stylex.props(styles.badge)}>
         <span {...stylex.props(styles.day)}>{day}</span>
         <span {...stylex.props(styles.month)}>{month}</span>
         {showYear && <span {...stylex.props(styles.year)}>{date.getFullYear()}</span>}
      </div>
   );
}
