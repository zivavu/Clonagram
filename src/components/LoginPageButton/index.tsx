import * as stylex from '@stylexjs/stylex';
import { ReactNode } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

interface LoginPageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	borderColor?: 'primary' | 'gray';
	variant: 'transparent' | 'primary' | 'outlined';
	icon?: ReactNode;
}

const styles = stylex.create({
	root: {
		height: '44px',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '10px',
		borderRadius: radius.xl,
		fontWeight: 500,
		fontSize: '15px',
		cursor: 'pointer',
		':disabled': {
			cursor: 'not-allowed',
		},
	},
	transparent: {
		backgroundColor: 'transparent',
		border: 'none',
		':hover': {
			backgroundColor: colors.buttonHover,
		},
	},
	primary: {
		backgroundColor: colors.accent,
		fontSize: '15px',
		':disabled': {
			opacity: 0.4,
			cursor: 'not-allowed',
		},
		':hover': {
			backgroundColor: colors.accentHover,
		},
	},
	outlined: {
		backgroundColor: 'transparent',
		borderColor: colors.border,
		borderWidth: '1px',
		borderStyle: 'solid',
		color: colors.textPrimary,
		':disabled': {
			cursor: 'not-allowed',
		},
		':hover': {
			backgroundColor: colors.buttonHover,
		},
	},
});

export default function LoginPageButton({
	text,
	variant = 'transparent',
	icon,
	...props
}: LoginPageButtonProps) {
	return (
		<button {...stylex.props(styles.root, styles[variant])} {...props}>
			{icon}
			{text}
		</button>
	);
}
