import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      width: '100%',
   },
   spinner: {
      width: 32,
      height: 32,
      border: '3px solid',
      borderColor: colors.border,
      borderTopColor: colors.primaryButton,
      borderRadius: '50%',
      animationName: stylex.keyframes({
         to: { transform: 'rotate(360deg)' },
      }),
      animationDuration: '0.8s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
   },
});

export default function MainLoading() {
   return (
      <div {...stylex.props(styles.container)}>
         <div {...stylex.props(styles.spinner)} />
      </div>
   );
}
