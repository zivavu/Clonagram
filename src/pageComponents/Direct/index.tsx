import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
   },
});

export default function DirectPage() {
   return <div {...stylex.props(styles.root)}></div>;
}
