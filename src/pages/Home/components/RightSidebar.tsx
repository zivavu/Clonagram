import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
   rightSidebar: {
      width: '351px',
      height: '100%',
   },
});

export default function RightSidebar() {
   return <div {...stylex.props(styles.rightSidebar)}></div>;
}
