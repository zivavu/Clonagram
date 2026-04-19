import * as stylex from '@stylexjs/stylex';
import FloatingInput from '../../components/FloatingInput';
import { colors } from '../../styles/styles/tokens.stylex';

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
		backgroundColor: colors.bg,
	},
	rightSection: {
		minWidth: '652px',
		maxWidth: '750px',
		height: '100%',
		backgroundColor: colors.bgSecondary,
		borderLeftWidth: '2px',
		borderLeftStyle: 'solid',
		borderLeftColor: colors.border,
		padding: '24px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default function LoginPage() {
	return (
		<div {...stylex.props(styles.root)}>
			<div {...stylex.props(styles.leftSection)}></div>
			<div {...stylex.props(styles.rightSection)}>
				<div>Log into Clonagram</div>
				<FloatingInput label="Mobile number, username or email" />
				<FloatingInput label="Password" type="password" />
				<button>Log in</button>
				<div>
					<div>Forgot password?</div>
					<div>
						Don&apos;t have an account? <a href="/signup">Sign up</a>
					</div>
				</div>
			</div>
		</div>
	);
}
