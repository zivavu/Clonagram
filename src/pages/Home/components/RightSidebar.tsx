import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
   rightSidebar: {
      width: '351px',
      height: '100%',
      backgroundColor: colors.bgElevated,
   },
});

export default function RightSidebar() {
   return <div {...stylex.props(styles.rightSidebar)}></div>;
}
