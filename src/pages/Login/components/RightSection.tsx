'use client';

import LoginPageButton from '@/src/components/LoginPageButton';
import * as stylex from '@stylexjs/stylex';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FloatingInput from '../../../components/FloatingInput';
import { colors, radius } from '../../../styles/tokens.stylex';

const styles = stylex.create({
	root: {
		minWidth: '652px',
		maxWidth: '750px',
		height: '100%',
		backgroundColor: colors.bgSecondary,
		borderLeftWidth: '2px',
		borderLeftStyle: 'solid',
		borderLeftColor: colors.border,
		padding: '52px',
		paddingTop: '96px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '1rem',
	},
	backButton: {
		backgroundColor: 'transparent',
		border: 'none',
		cursor: 'pointer',
		borderRadius: radius.full,
		padding: '8px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		':hover': {
			backgroundColor: colors.buttonHover,
		},
	},
	titleContainer: {
		fontSize: '1.125rem',
		fontWeight: '600',
		color: colors.textPrimary,
		alignSelf: 'flex-start',
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		marginBottom: '10px',
	},
	reportContent: {
		marginTop: '42px',
		fontSize: '0.8125rem',
		color: colors.textSecondary,
	},
	reportContentLink: {
		color: colors.accentText,
		fontSize: '0.8125rem',
		fontWeight: '600',
		':hover': {
			color: colors.accentTextHover,
			textDecoration: 'underline',
		},
	},
});

const GoogleIcon = (
	<Image src="/icons/google.svg" alt="" aria-hidden width={20} height={20} />
);

export default function RightSection() {
	return (
		<div {...stylex.props(styles.root)}>
			<div {...stylex.props(styles.titleContainer)}>
				<Link href="/" {...stylex.props(styles.backButton)}>
					<ChevronLeft />
				</Link>
				Log into Clonagram
			</div>
			<FloatingInput label="Mobile number, username or email" />
			<FloatingInput label="Password" type="password" />
			<LoginPageButton
				variant="primary"
				text="Log in"
				style={{ marginTop: '12px' }}
			/>
			<LoginPageButton variant="transparent" text="Forgot password?" />
			<LoginPageButton
				variant="outlined"
				text="Log in with Google"
				icon={GoogleIcon}
				style={{ marginTop: '42px' }}
			/>
			<LoginPageButton
				variant="outlined"
				text="Create new account"
				style={{ borderColor: colors.accent, color: colors.accent }}
			/>
			<span {...stylex.props(styles.reportContent)}>
				You can also{' '}
				<Link href="/" {...stylex.props(styles.reportContentLink)}>
					report content you believe is unlawful
				</Link>{' '}
				in your country without logging in.
			</span>
		</div>
	);
}
