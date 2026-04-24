'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';
import FloatingInput, { FloatingInputProps } from '../FloatingInput';

interface EmailSignupInputProps extends FloatingInputProps {
	topLabel: string;
}

const styles = stylex.create({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		marginTop: '16px',
	},
	topLabel: {
		fontSize: '1.125rem',
		fontWeight: '500',
		color: colors.textPrimary,
	},
});

export default function EmailSignupInput({
	label,
	topLabel,
	onChange,
	...props
}: EmailSignupInputProps) {
	return (
		<div {...stylex.props(styles.wrapper)}>
			<label {...stylex.props(styles.topLabel)}>{topLabel}</label>
			<FloatingInput label={label} {...props} onChange={onChange} />
		</div>
	);
}
