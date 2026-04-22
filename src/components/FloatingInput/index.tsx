'use client';
import * as stylex from '@stylexjs/stylex';
import { InputHTMLAttributes, useState } from 'react';
import { colors, fonts, radius } from '../../styles/tokens.stylex';

interface FloatingInputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'placeholder'
> {
	label: string;
}

const styles = stylex.create({
	wrapper: {
		position: 'relative',
		width: '100%',
	},
	input: {
		width: '100%',
		height: '56px',
		paddingTop: '18px',
		paddingBottom: '6px',
		paddingLeft: '12px',
		paddingRight: '12px',
		fontSize: '14px',
		fontFamily: fonts.body,
		color: colors.textPrimary,
		backgroundColor: colors.bgSecondary,
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: colors.border,
		borderRadius: radius.lg,
		transition: 'border-color 0.15s ease',
	},
	inputFocused: {
		borderColor: colors.accent,
	},
	label: {
		position: 'absolute',
		left: '12px',
		top: '50%',
		transform: 'translateY(-50%)',
		fontSize: '16px',
		fontWeight: '400',
		fontFamily: fonts.body,
		color: colors.textSecondary,
		pointerEvents: 'none',
		transition:
			'top 0.15s ease, font-size 0.15s ease, transform 0.15s ease, color 0.15s ease',
	},
	labelFloated: {
		top: '6px',
		transform: 'translateY(0)',
		fontSize: '12px',
	},
	labelFocused: {
		color: colors.accent,
	},
});

export default function FloatingInput({
	label,
	onChange,
	...props
}: FloatingInputProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [hasValue, setHasValue] = useState(false);

	const floated = isFocused || hasValue;

	return (
		<div {...stylex.props(styles.wrapper)}>
			<input
				{...stylex.props(styles.input, isFocused && styles.inputFocused)}
				{...props}
				onFocus={(e) => {
					setIsFocused(true);
					props.onFocus?.(e);
				}}
				onBlur={(e) => {
					setIsFocused(false);
					props.onBlur?.(e);
				}}
				onChange={(e) => {
					setHasValue(e.target.value.length > 0);
					onChange?.(e);
				}}
			/>
			<label
				{...stylex.props(
					styles.label,
					floated && styles.labelFloated,
					isFocused && styles.labelFocused,
				)}>
				{label}
			</label>
		</div>
	);
}
