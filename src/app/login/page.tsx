import { colors } from '@/src/styles/styles/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

export default function LoginPage() {
	const styles = stylex.create({
		root: {
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		leftSection: {
			width: '100%',
			height: '100%',
		},
		rightSection: {
			minWidth: '550px',
			maxWidth: '650px',
			height: '100%',
			backgroundColor: colors.bg,
		},
	});

	return (
		<div {...stylex.props(styles.root)}>
			<div {...stylex.props(styles.leftSection)}></div>
			<div {...stylex.props(styles.rightSection)}></div>
		</div>
	);
}
