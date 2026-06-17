import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
   container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 4,
      padding: 4,
      maxWidth: 935,
      margin: '0 auto',
      width: '100%',
   },
   placeholder: {
      aspectRatio: '1',
      backgroundColor: colors.border,
      borderRadius: 4,
   },
});

export default function ExploreLoading() {
   return (
      <div {...stylex.props(styles.container)}>
         {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} {...stylex.props(styles.placeholder)} />
         ))}
      </div>
   );
}
